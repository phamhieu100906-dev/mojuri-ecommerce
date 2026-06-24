import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { requireAdmin } from '../../../lib/auth';
import { z } from 'zod';

const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  thumbnail: z.string(),
  images: z.array(z.string()).default([]),
  price: z.number().positive(),
  salePrice: z.number().positive().nullable().optional(),
  stock: z.number().nonnegative().default(0),
  category: z.string(),
  status: z.enum(['IN_STOCK', 'OUT_OF_STOCK']).default('IN_STOCK'),
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    let minPrice = parseFloat(searchParams.get('minPrice') || '0');
    let maxPrice = parseFloat(searchParams.get('maxPrice') || '999999');
    if (isNaN(minPrice)) minPrice = 0;
    if (isNaN(maxPrice)) maxPrice = 999999;
    const sort = searchParams.get('sort');
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '8');
    const skip = (page - 1) * limit;

    const where = {};

    if (category && category !== 'All') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    where.price = {
      gte: minPrice,
      lte: maxPrice,
    };

    let orderBy = { createdAt: 'desc' };
    if (sort === 'price-asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price-desc') {
      orderBy = { price: 'desc' };
    }

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      prisma.product.count({ where }),
    ]);

    const formattedProducts = products.map((p) => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : [],
    }));

    return NextResponse.json({
      products: formattedProducts,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    requireAdmin(request);
    
    const body = await request.json();
    const parsedData = createProductSchema.parse(body);

    const product = await prisma.product.create({
      data: {
        name: parsedData.name,
        description: parsedData.description,
        thumbnail: parsedData.thumbnail,
        images: JSON.stringify(parsedData.images),
        price: parsedData.price,
        salePrice: parsedData.salePrice || null,
        stock: parsedData.stock,
        category: parsedData.category,
        status: parsedData.stock > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK',
      },
    });

    return NextResponse.json({
      ...product,
      images: JSON.parse(product.images),
    });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
