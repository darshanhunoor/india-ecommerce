import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { DeliveryService } from '../delivery/delivery.service';
import { PaymentsService } from '../payments/payments.service';
import { PaymentMethod } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private cartService: CartService,
    private deliveryService: DeliveryService,
    private paymentsService: PaymentsService,
  ) {}

  async createOrder(userId: string, addressId: string, paymentMethod: PaymentMethod) {
    // 1. Fetch backend authenticated cart directly
    const cart = await this.cartService.getCart(userId, undefined);
    if (cart.items.length === 0) throw new BadRequestException('Cart is empty');

    // 2. Validate Address
    const address = await this.prisma.address.findFirst({ where: { id: addressId, user_id: userId } });
    if (!address) throw new NotFoundException('Address not found');

    // 3. Verify Pincode Serviceability dynamically via Shiprocket
    const deliveryCheck: any = await this.deliveryService.checkServiceability(address.pin_code);
    if (!deliveryCheck.is_serviceable) {
      throw new BadRequestException('Address pincode is not serviceable');
    }
    if (paymentMethod === 'COD' && !deliveryCheck.cod_available) {
      throw new BadRequestException('COD is not available for this pincode');
    }

    // 4. Double check all stock limits using a localized lock simulation (DB constraint natively)
    for (const item of cart.items) {
      const product = await this.prisma.product.findUnique({ where: { id: item.productId }});
      if (!product || product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for product ${item.name}`);
      }
    }

    // 5. Build transaction payload to absolutely lock prices and deductions
    const orderData = await this.prisma.$transaction(async (tx) => {
      // Create Order Record
      const order = await tx.order.create({
        data: {
          user_id: userId,
          address_id: addressId,
          total_paise: cart.total_paise,
          gst_paise: cart.gst_paise,
          delivery_paise: cart.delivery_paise,
          payment_method: paymentMethod,
          status: 'PENDING',
          // order_items will be created relational map
          order_items: {
            create: cart.items.map((item) => ({
              variant_id: item.productId, // using product ID for variant for now inside MVP
              qty: item.quantity,
              price_paise: item.price_paise,
              gst_rate: Number(item.gst_rate),
              hsn_code: '0000', // Mock HSN if not mapped
            }))
          }
        },
        include: { order_items: true }
      });

      // Stock Decrementing mathematically to prevent race conditions natively
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      return order;
    });

    // 6. Nuke User's cached Cart immediately off Redis to prevent double ordering
    await this.cartService.clearCart(userId, '');

    let razorpayOrderId = null;
    if (paymentMethod === 'RAZORPAY') {
      const rpOrder = await this.paymentsService.createRazorpayOrder(orderData.total_paise, orderData.id);
      razorpayOrderId = rpOrder.id;
      
      // Save the razorpay_order_id in DB
      await this.prisma.order.update({
        where: { id: orderData.id },
        data: { razorpay_order_id: razorpayOrderId }
      });
    }

    return { 
      order_id: orderData.id, 
      razorpay_order_id: razorpayOrderId, 
      total_paise: orderData.total_paise, 
      estimated_delivery_days: deliveryCheck.estimated_days 
    };
  }

  async getOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { user_id: userId },
      include: {
        order_items: {
           include: { variant: true }
        },
        address: true
      }
    });
  }

  async getOrder(userId: string, orderId: string) {
    return this.prisma.order.findFirst({
      where: { id: orderId, user_id: userId },
      include: {
        order_items: {
           include: { variant: { include: { product: true } } }
        },
        address: true
      }
    });
  }
}
