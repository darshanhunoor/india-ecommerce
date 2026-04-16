import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}

  async getAddresses(userId: string) {
    return this.prisma.address.findMany({
      where: { user_id: userId },
      orderBy: { is_default: 'desc' },
    });
  }

  async createAddress(userId: string, data: any) {
    if (!data.pin_code || !/^\d{6}$/.test(data.pin_code)) {
      throw new BadRequestException('Invalid pincode format. Must be 6 digits.');
    }

    const existingAddressesCount = await this.prisma.address.count({
      where: { user_id: userId },
    });

    const isFirstAddress = existingAddressesCount === 0;

    return this.prisma.address.create({
      data: {
        user_id: userId,
        label: data.label,
        flat: data.flat,
        street: data.street,
        city: data.city,
        state: data.state,
        pin_code: data.pin_code,
        is_default: isFirstAddress,
      },
    });
  }

  async updateAddress(userId: string, addressId: string, data: any) {
    if (data.pin_code && !/^\d{6}$/.test(data.pin_code)) {
      throw new BadRequestException('Invalid pincode format. Must be 6 digits.');
    }

    const address = await this.prisma.address.findFirst({
      where: { id: addressId, user_id: userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    return this.prisma.address.update({
      where: { id: addressId },
      data: {
        label: data.label,
        flat: data.flat,
        street: data.street,
        city: data.city,
        state: data.state,
        pin_code: data.pin_code,
      },
    });
  }

  async deleteAddress(userId: string, addressId: string) {
    const address = await this.prisma.address.findFirst({
      where: { id: addressId, user_id: userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    await this.prisma.address.delete({
      where: { id: addressId },
    });

    return { success: true };
  }

  async setDefaultAddress(userId: string, addressId: string) {
    const address = await this.prisma.address.findFirst({
      where: { id: addressId, user_id: userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    // Unset all other defaults in a transaction
    await this.prisma.$transaction([
      this.prisma.address.updateMany({
        where: { user_id: userId, is_default: true },
        data: { is_default: false },
      }),
      this.prisma.address.update({
        where: { id: addressId },
        data: { is_default: true },
      }),
    ]);

    return { success: true };
  }
}
