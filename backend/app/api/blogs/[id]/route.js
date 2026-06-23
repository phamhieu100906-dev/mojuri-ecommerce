import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { requireAdmin } from '../../../../lib/auth';
import { z } from 'zod';

const updateBlogSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().optional(),
  coverImage: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
});

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const blog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    const recentBlogs = await prisma.blog.findMany({
      where: {
        id: { not: id },
        status: 'PUBLISHED',
      },
      take: 3,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      blog,
      recent: recentBlogs,
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
    const parsedData = updateBlogSchema.parse(body);

    const existingBlog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    const updateData = {};
    if (parsedData.title !== undefined) updateData.title = parsedData.title;
    if (parsedData.content !== undefined) updateData.content = parsedData.content;
    if (parsedData.coverImage !== undefined) updateData.coverImage = parsedData.coverImage;
    if (parsedData.category !== undefined) updateData.category = parsedData.category;
    if (parsedData.status !== undefined) updateData.status = parsedData.status;

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedBlog);
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

    const existingBlog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    await prisma.blog.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Blog post deleted successfully' });
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
