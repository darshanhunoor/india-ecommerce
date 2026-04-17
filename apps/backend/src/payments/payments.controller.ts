import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('verify')
  @UseGuards(JwtAuthGuard)
  async verifyPayment(@Body() body: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
    order_id: string;
  }) {
    return this.paymentsService.verifyPayment(
      body.razorpay_signature,
      body.razorpay_order_id,
      body.razorpay_payment_id,
      body.order_id
    );
  }
}
