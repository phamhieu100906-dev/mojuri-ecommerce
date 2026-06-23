import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { verifyToken } from '../../../lib/auth';
import { z } from 'zod';

const createOrderSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  email: z.string().email(),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
    })
  ).min(1),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const parsedData = createOrderSchema.parse(body);

    const userPayload = verifyToken(request);
    const userId = userPayload ? userPayload.id : null;

    const result = await prisma.$transaction(async (tx) => {
      let totalPrice = 0;
      const verifiedItems = [];

      for (const item of parsedData.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
        }

        const price = product.salePrice !== null ? product.salePrice : product.price;
        totalPrice += price * item.quantity;

        verifiedItems.push({
          productId: product.id,
          quantity: item.quantity,
          price,
          product,
        });
      }

      const order = await tx.order.create({
        data: {
          userId,
          name: parsedData.name,
          phone: parsedData.phone,
          address: parsedData.address,
          email: parsedData.email,
          totalPrice,
          status: 'PENDING',
        },
      });

      for (const item of verifiedItems) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          },
        });

        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: item.product.stock - item.quantity,
            status: item.product.stock - item.quantity > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK',
          },
        });
      }

      return order;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 400 }
    );
  }
}

export async function GET(request) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let orders;
    if (decoded.role === 'ADMIN') {
      orders = await prisma.order.findMany({
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      orders = await prisma.order.findMany({
        where: { userId: decoded.id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    const formattedOrders = orders.map((o) => ({
      ...o,
      items: o.items.map((i) => ({
        ...i,
        product: {
          ...i.product,
          images: i.product.images ? JSON.parse(i.product.images) : [],
        },
      })),
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
