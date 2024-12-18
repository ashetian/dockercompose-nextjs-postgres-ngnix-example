import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT({ params, request }: { params: { id: string }; request: Request }) {
  const { title, content } = await request.json();

  const updatedNote = await prisma.note.update({
    where: { id: parseInt(params.id) },
    data: { title, content },
  });

  return NextResponse.json(updatedNote);
}
