import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { requireAdmin } from '../../../../lib/auth';
import { z } from 'zod';

const updateContactSchema = z.object({
  isRead: z.boolean(),
});

export async function PUT(request, { params }) {
  try {
    requireAdmin(request);
    const { id } = await params;
    const body = await request.json();
    const parsedData = updateContactSchema.parse(body);

    const contact = await prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      return NextResponse.json({ error: 'Contact message not found' }, { status: 404 });
    }

    const updatedContact = await prisma.contact.update({
      where: { id },
      data: {
        isRead: parsedData.isRead,
      },
    });

    return NextResponse.json(updatedContact);
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
