import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { requireAdmin } from '../../../../lib/auth';
import { z } from 'zod';

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  images: z.array(z.string()).optional(),
  price: z.number().positive().optional(),
  salePrice: z.number().positive().nullable().optional(),
  stock: z.number().nonnegative().optional(),
  category: z.string().optional(),
  status: z.enum(['IN_STOCK', 'OUT_OF_STOCK']).optional(),
});

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const relatedProducts = await prisma.product.findMany({
      where: {
        category: product.category,
        id: { not: id },
      },
      take: 4,
    });

    const formattedProduct = {
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
    };

    const formattedRelated = relatedProducts.map((p) => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : [],
    }));

    return NextResponse.json({
      product: formattedProduct,
      related: formattedRelated,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    requireAdmin(request);
    const { id } = await params;
    const body = await request.json();
    const parsedData = updateProductSchema.parse(body);

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const updateData = {};
    if (parsedData.name !== undefined) updateData.name = parsedData.name;
    if (parsedData.description !== undefined) updateData.description = parsedData.description;
    if (parsedData.thumbnail !== undefined) updateData.thumbnail = parsedData.thumbnail;
    if (parsedData.images !== undefined) updateData.images = JSON.stringify(parsedData.images);
    if (parsedData.price !== undefined) updateData.price = parsedData.price;
    if (parsedData.salePrice !== undefined) updateData.salePrice = parsedData.salePrice;
    if (parsedData.stock !== undefined) {
      updateData.stock = parsedData.stock;
      updateData.status = parsedData.stock > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK';
    }
    if (parsedData.category !== undefined) updateData.category = parsedData.category;
    if (parsedData.status !== undefined) updateData.status = parsedData.status;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      ...updatedProduct,
      images: JSON.parse(updatedProduct.images),
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

export async function DELETE(request, { params }) {
  try {
    requireAdmin(request);
    const { id } = await params;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 });
    }
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
