import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { requireAdmin, verifyToken } from '../../../lib/auth';
import { z } from 'zod';

const createBlogSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
  coverImage: z.string(),
  category: z.string(),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    const decoded = verifyToken(request);
    const isAdmin = decoded && decoded.role === 'ADMIN';

    const where = {};
    if (category) {
      where.category = category;
    }

    if (!isAdmin) {
      where.status = 'PUBLISHED';
    }

    const blogs = await prisma.blog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(blogs);
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
    const parsedData = createBlogSchema.parse(body);

    const blog = await prisma.blog.create({
      data: {
        title: parsedData.title,
        content: parsedData.content,
        coverImage: parsedData.coverImage,
        category: parsedData.category,
        status: parsedData.status,
      },
    });

    return NextResponse.json(blog, { status: 201 });
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
