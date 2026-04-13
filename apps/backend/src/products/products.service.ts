import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export type ProductFilterQuery = {
  page?: string | number;
  limit?: string | number;
  cat?: string;
  minPrice?: string;
  maxPrice?: string;
  q?: string;
  sort?: string;
};

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: ProductFilterQuery) {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 20);
    const cat = query.cat;
    const minPrice = query.minPrice;
    const maxPrice = query.maxPrice;
    const q = query.q;
    const sort = query.sort;

    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};
    if (cat) {
      where.category = { slug: cat };
    }

    if (minPrice || maxPrice) {
      where.price_paise = {};
      if (minPrice) (where.price_paise as Prisma.IntFilter).gte = parseInt(minPrice, 10);
      if (maxPrice) (where.price_paise as Prisma.IntFilter).lte = parseInt(maxPrice, 10);
    }

    if (q) {
      where.OR = [
        { brand: { contains: q, mode: 'insensitive' } },
        { slug: { contains: q, mode: 'insensitive' } },
      ];
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    if (sort === 'price_asc') orderBy.price_paise = 'asc';
    else if (sort === 'price_desc') orderBy.price_paise = 'desc';
    else orderBy.id = 'desc';

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: { category: true, reviews: true },
      }),
      this.prisma.product.count({ where }),
    ]);

    const data = items.map((p) => {
      const discountPercentage =
        p.mrp_paise > 0
          ? Math.round(((p.mrp_paise - p.price_paise) / p.mrp_paise) * 100)
          : 0;

      const avgRating =
        p.reviews.length > 0
          ? p.reviews.reduce((acc, rev) => acc + rev.rating, 0) /
            p.reviews.length
          : 0;

      return {
        ...p,
        discountPercentage,
        average_rating: avgRating,
      };
    });

    return {
      data,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  async findOneBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        variants: true,
        reviews: true,
      },
    });

    if (!product) throw new NotFoundException('Product not found');

    const discountPercentage =
      product.mrp_paise > 0
        ? Math.round(
            ((product.mrp_paise - product.price_paise) / product.mrp_paise) *
              100,
          )
        : 0;

    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((acc, rev) => acc + rev.rating, 0) /
          product.reviews.length
        : 0;

    return {
      ...product,
      discountPercentage,
      average_rating: avgRating,
    };
  }
}
