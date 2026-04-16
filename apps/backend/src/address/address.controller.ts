import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { AddressService } from './address.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/addresses')
@UseGuards(JwtAuthGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  async getAddresses(@Req() req: any) {
    return this.addressService.getAddresses(req.user.id);
  }

  @Post()
  async createAddress(@Req() req: any, @Body() data: any) {
    return this.addressService.createAddress(req.user.id, data);
  }

  @Patch(':id')
  async updateAddress(@Req() req: any, @Param('id') id: string, @Body() data: any) {
    return this.addressService.updateAddress(req.user.id, id, data);
  }

  @Delete(':id')
  async deleteAddress(@Req() req: any, @Param('id') id: string) {
    return this.addressService.deleteAddress(req.user.id, id);
  }

  @Patch(':id/default')
  async setDefaultAddress(@Req() req: any, @Param('id') id: string) {
    return this.addressService.setDefaultAddress(req.user.id, id);
  }
}
