import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const { title, content } = await request.json();

  const newNote = await prisma.note.create({
    data: {
      title,
      content,
    },
  });

  return NextResponse.json(newNote);
}
