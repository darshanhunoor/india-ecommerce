import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const { page = 1, limit = 20, cat, minPrice, maxPrice, q, sort } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (cat) where.category = { slug: cat };
    
    if (minPrice || maxPrice) {
      where.price_paise = {};
      if (minPrice) where.price_paise.gte = parseInt(minPrice);
      if (maxPrice) where.price_paise.lte = parseInt(maxPrice);
    }
    
    if (q) {
      where.OR = [
        { brand: { contains: q, mode: 'insensitive' } },
        { slug: { contains: q, mode: 'insensitive' } },
        // name is JSONB, standard filtering is limited unless using raw, but for MVP slug/brand is okay
      ];
    }

    const orderBy: any = {};
    if (sort === 'price_asc') orderBy.price_paise = 'asc';
    else if (sort === 'price_desc') orderBy.price_paise = 'desc';
    else orderBy.id = 'desc'; // defaults to newest

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: parseInt(limit.toString()),
        orderBy,
        include: { category: true, reviews: true },
      }),
      this.prisma.product.count({ where }),
    ]);

    const data = items.map(p => {
      const discountPercentage = p.mrp_paise > 0 
        ? Math.round(((p.mrp_paise - p.price_paise) / p.mrp_paise) * 100)
        : 0;
      
      const avgRating = p.reviews.length > 0 
          ? p.reviews.reduce((acc, rev) => acc + rev.rating, 0) / p.reviews.length 
          : 0;
      
      return {
        ...p,
        discountPercentage,
        average_rating: avgRating
      };
    });

    return {
      data,
      meta: {
        total,
        page: parseInt(page.toString()),
        last_page: Math.ceil(total / parseInt(limit.toString())),
      }
    };
  }

  async findOneBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        variants: true,
        reviews: true,
      }
    });

    if (!product) throw new NotFoundException('Product not found');

    const discountPercentage = product.mrp_paise > 0
      ? Math.round(((product.mrp_paise - product.price_paise) / product.mrp_paise) * 100)
      : 0;

    const avgRating = product.reviews.length > 0 
        ? product.reviews.reduce((acc, rev) => acc + rev.rating, 0) / product.reviews.length 
        : 0;

    return {
      ...product,
      discountPercentage,
      average_rating: avgRating
    };
  }
}
