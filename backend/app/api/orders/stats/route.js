import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { requireAdmin } from '../../../../lib/auth';

export async function GET(request) {
  try {
    requireAdmin(request);

    const orders = await prisma.order.findMany({
      where: {
        status: {
          not: 'CANCELLED',
        },
      },
      include: {
        items: true,
      },
    });

    const totalOrders = await prisma.order.count();
    const totalProducts = await prisma.product.count();

    let totalRevenue = 0;
    let totalItemsSold = 0;

    orders.forEach((o) => {
      totalRevenue += o.totalPrice;
      o.items.forEach((i) => {
        totalItemsSold += i.quantity;
      });
    });

    const dailyRevenue = {};
    orders.forEach((o) => {
      const dateStr = o.createdAt.toISOString().split('T')[0];
      dailyRevenue[dateStr] = (dailyRevenue[dateStr] || 0) + o.totalPrice;
    });

    const revenueChart = Object.keys(dailyRevenue).map((date) => ({
      date,
      revenue: dailyRevenue[date],
    })).sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      totalItemsSold,
      revenueChart,
    });
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
