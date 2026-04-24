import { Controller, Get, Post, Patch, Delete, Body, Param, Req, Headers } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('api/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Req() req: any, @Headers('x-guest-uuid') guestUuid: string) {
    const userId = req.cookies?.access_token ? req.user?.id : undefined; // we will let JwtAuthGuard append if optional or just extract from cookie manually if not protected route
    return { cart: await this.cartService.getCart(userId, guestUuid) };
  }

  @Post()
  async addItem(@Headers('x-guest-uuid') guestUuid: string, @Body() body: { productId: string; quantity: number }, @Req() req: any) {
    const userId = req.cookies?.access_token ? req.user?.id : undefined;
    const cart = await this.cartService.addItem(userId, guestUuid, body.productId, body.quantity);
    return { cart };
  }

  @Patch(':id')
  async updateQuantity(@Headers('x-guest-uuid') guestUuid: string, @Param('id') productId: string, @Body() body: { quantity: number }, @Req() req: any) {
    const userId = req.cookies?.access_token ? req.user?.id : undefined;
    const cart = await this.cartService.updateQuantity(userId, guestUuid, productId, body.quantity);
    return { cart };
  }

  @Delete(':id')
  async removeItem(@Headers('x-guest-uuid') guestUuid: string, @Param('id') productId: string, @Req() req: any) {
    const userId = req.cookies?.access_token ? req.user?.id : undefined;
    const cart = await this.cartService.removeItem(userId, guestUuid, productId);
    return { cart };
  }

  @Delete()
  async clearCart(@Headers('x-guest-uuid') guestUuid: string, @Req() req: any) {
    const userId = req.cookies?.access_token ? req.user?.id : undefined;
    const cart = await this.cartService.clearCart(userId, guestUuid);
    return { cart };
  }

  @Post('merge')
  async mergeCarts(
    @Headers('x-guest-uuid') guestUuid: string,
    @Body() body: { items?: { productId: string; quantity: number }[] },
    @Req() req: any
  ) {
    const userId = req.cookies?.access_token ? req.user?.id : undefined; // Require logged in user implicitly if they hit merge
    if (!userId) return { error: 'Not authenticated' };
    const cart = await this.cartService.mergeCarts(userId, guestUuid, body.items);
    return { cart };
  }
}
