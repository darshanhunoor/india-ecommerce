import { Controller, Get, Query } from '@nestjs/common';
import { DeliveryService } from './delivery.service';

@Controller('api/delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get('check')
  async checkServiceability(@Query('pin') pin: string) {
    return this.deliveryService.checkServiceability(pin);
  }
}
