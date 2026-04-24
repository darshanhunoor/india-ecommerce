import { Controller, Get, Param, Query, Header } from '@nestjs/common';
import { ProductsService } from './products.service';
import type { ProductFilterQuery } from './products.service';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Note: All product endpoints are public (no auth required).
  // Auth guards (JWT/OTP) will be introduced globally or for
  // specific modules (like Cart/Orders) later.

  @Get()
  @Header('Cache-Control', 'public, s-maxage=60')
  async findAll(@Query() query: ProductFilterQuery) {
    return await this.productsService.findAll(query);
  }

  @Get(':slug')
  @Header('Cache-Control', 'public, s-maxage=60')
  async findOne(@Param('slug') slug: string) {
    return await this.productsService.findOneBySlug(slug);
  }
}
