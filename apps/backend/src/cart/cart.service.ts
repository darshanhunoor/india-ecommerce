import { Injectable, BadRequestException } from '@nestjs/common';
import { Redis } from '@upstash/redis';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  private redis: Redis;

  constructor(private prisma: PrismaService) {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_URL,
      token: process.env.UPSTASH_REDIS_TOKEN,
    });
  }

  private getCartKey(userId?: string, guestUuid?: string) {
    if (userId) return `cart:user:${userId}`;
    if (guestUuid) return `cart:guest:${guestUuid}`;
    throw new BadRequestException('Guest UUID or User ID required');
  }

  // Base logic to calculate monetary values accurately from live DB
  async calculateCart(itemsData: any[]) {
    let subtotal_paise = 0;
    let discount_paise = 0;
    let gst_paise = 0;
    const items = [];

    // Pre-fetch live product prices
    for (const item of itemsData) {
      if (item.quantity <= 0) continue;
      const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) continue;

      let qty = item.quantity;
      if (qty > product.stock) {
        qty = product.stock; // cap to available stock strictly
      }
      if (qty === 0) continue; // Out of stock

      const itemTotal = product.price_paise * qty;
      const itemMrpTotal = product.mrp_paise * qty;
      
      subtotal_paise += itemMrpTotal;
      discount_paise += (itemMrpTotal - itemTotal);
      
      // Calculate GST portion natively. Total GST = items * rate inclusive or exclusive?
      // Typically if price is inclusive of GST: GST Amount = Price - (Price / (1 + Rate))
      // For MVP, assuming price_paise is EXCLUSIVE of GST: GST = Price * (Rate / 100)
      const gstAmount = Math.round(itemTotal * (Number(product.gst_rate) / 100));
      gst_paise += gstAmount;

      items.push({
        id: product.id,
        productId: product.id,
        name: (product.name as Record<string, string>)['en'] || 'Product',
        slug: product.slug,
        price_paise: product.price_paise,
        mrp_paise: product.mrp_paise,
        quantity: qty,
        image: product.images[0] || '',
        stock: product.stock,
        gst_rate: product.gst_rate
      });
    }

    const delivery_paise = subtotal_paise - discount_paise > 50000 ? 0 : 5000; // 500 Rs free delivery threshold, else 50 Rs
    const total_paise = subtotal_paise - discount_paise + gst_paise + delivery_paise;

    return {
      items,
      subtotal_paise,
      discount_paise,
      gst_paise,
      delivery_paise,
      total_paise,
      couponCode: null // Placeholder for coupon implementation
    };
  }

  async getCart(userId?: string, guestUuid?: string) {
    const key = this.getCartKey(userId, guestUuid);
    const cartData = await this.redis.get<any[]>(key) || [];
    return await this.calculateCart(cartData);
  }

  async addItem(userId: string | undefined, guestUuid: string, productId: string, quantity: number) {
    const key = this.getCartKey(userId, guestUuid);
    const cartData = await this.redis.get<any[]>(key) || [];
    
    // Check Database stock constraints first
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.stock < quantity) throw new BadRequestException('Not enough stock available');

    const existingIndex = cartData.findIndex(item => item.productId === productId);
    if (existingIndex >= 0) {
      cartData[existingIndex].quantity += quantity;
      if (cartData[existingIndex].quantity > product.stock) cartData[existingIndex].quantity = product.stock;
    } else {
      cartData.push({ productId, quantity });
    }

    const ttl = userId ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7; // 30 days user, 7 days guest
    await this.redis.set(key, cartData, { ex: ttl });

    return await this.calculateCart(cartData);
  }

  async updateQuantity(userId: string | undefined, guestUuid: string, productId: string, quantity: number) {
    const key = this.getCartKey(userId, guestUuid);
    let cartData = await this.redis.get<any[]>(key) || [];
    
    if (quantity <= 0) {
      cartData = cartData.filter(item => item.productId !== productId);
    } else {
      const product = await this.prisma.product.findUnique({ where: { id: productId } });
      if (!product || product.stock < quantity) throw new BadRequestException('Not enough stock available');
      const item = cartData.find(item => item.productId === productId);
      if (item) item.quantity = quantity;
    }

    const ttl = userId ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7;
    await this.redis.set(key, cartData, { ex: ttl });

    return await this.calculateCart(cartData);
  }

  async removeItem(userId: string | undefined, guestUuid: string, productId: string) {
    const key = this.getCartKey(userId, guestUuid);
    let cartData = await this.redis.get<any[]>(key) || [];
    cartData = cartData.filter(item => item.productId !== productId);
    
    const ttl = userId ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7;
    if (cartData.length > 0) {
      await this.redis.set(key, cartData, { ex: ttl });
    } else {
      await this.redis.del(key);
    }

    return await this.calculateCart(cartData);
  }

  async clearCart(userId: string | undefined, guestUuid: string) {
    const key = this.getCartKey(userId, guestUuid);
    await this.redis.del(key);
    return await this.calculateCart([]);
  }

  async mergeCarts(userId: string, guestUuid?: string, clientItems?: { productId: string; quantity: number }[]) {
    const userKey = this.getCartKey(userId, undefined);
    const userCart = await this.redis.get<any[]>(userKey) || [];

    let guestCart: any[] = [];
    if (guestUuid) {
      const guestKey = this.getCartKey(undefined, guestUuid);
      guestCart = await this.redis.get<any[]>(guestKey) || [];
      await this.redis.del(guestKey);
    }
    
    if (clientItems && clientItems.length > 0) {
      guestCart = [...guestCart, ...clientItems];
    }

    if (guestCart.length === 0) {
       return await this.calculateCart(userCart);
    }

    // Resolve conflicts by taking the highest quantity gracefully
    const mergedMap = new Map<string, number>();
    for (const item of userCart) mergedMap.set(item.productId, item.quantity);
    for (const item of guestCart) {
      if (mergedMap.has(item.productId)) {
        mergedMap.set(item.productId, Math.max(mergedMap.get(item.productId)!, item.quantity));
      } else {
        mergedMap.set(item.productId, item.quantity);
      }
    }

    const mergedCart = Array.from(mergedMap, ([productId, quantity]) => ({ productId, quantity }));

    await this.redis.set(userKey, mergedCart, { ex: 60 * 60 * 24 * 30 });

    return await this.calculateCart(mergedCart);
  }
}
