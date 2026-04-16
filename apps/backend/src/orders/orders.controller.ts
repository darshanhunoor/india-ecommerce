import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaymentMethod } from '@prisma/client';

interface RequestWithUser {
  user: {
    id: string;
    mobile: string;
  };
}

@Controller('api/orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(
    @Req() req: RequestWithUser,
    @Body() body: { addressId: string; paymentMethod: PaymentMethod },
  ) {
    return this.ordersService.createOrder(
      req.user.id,
      body.addressId,
      body.paymentMethod,
    );
  }

  @Get()
  async getOrders(@Req() req: RequestWithUser) {
    return this.ordersService.getOrders(req.user.id);
  }

  @Get(':id')
  async getOrder(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.ordersService.getOrder(req.user.id, id);
  }
}
