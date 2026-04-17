import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';
const Razorpay = require('razorpay');

@Injectable()
export class PaymentsService {
  private razorpay: any;

  constructor(private prisma: PrismaService) {
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      this.razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
    }
  }

  async createRazorpayOrder(amountPaise: number, receiptId: string) {
    if (!this.razorpay) {
      console.warn('Razorpay keys not configured. Returning mock order.');
      return { id: `mock_order_${Date.now()}`, amount: amountPaise, currency: 'INR' };
    }

    try {
      const order = await this.razorpay.orders.create({
        amount: amountPaise,
        currency: 'INR',
        receipt: receiptId,
      });
      return order;
    } catch (error) {
      console.error('Razorpay Error:', error);
      throw new BadRequestException('Failed to create Razorpay order');
    }
  }

  async verifyPayment(signature: string, orderId: string, paymentId: string, dbOrderId: string) {
    if (process.env.RAZORPAY_KEY_SECRET) {
      const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
      shasum.update(`${orderId}|${paymentId}`);
      const digest = shasum.digest('hex');

      if (digest !== signature) {
        throw new BadRequestException('Invalid payment signature');
      }
    }

    const order = await this.prisma.order.findUnique({ where: { id: dbOrderId } });
    if (!order) throw new BadRequestException('Order not found');

    await this.prisma.order.update({
      where: { id: dbOrderId },
      data: { status: 'CONFIRMED' },
    });

    await this.prisma.payment.create({
      data: {
        order_id: dbOrderId,
        gateway: 'RAZORPAY',
        gateway_payment_id: paymentId,
        status: 'COMPLETED',
        amount_paise: order.total_paise,
        captured_at: new Date(),
      }
    });

    return { success: true };
  }
}
