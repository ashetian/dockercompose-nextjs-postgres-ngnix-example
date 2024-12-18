import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: Request, context: { params: { id: string } }) {
  const { id } = await context.params; // Await `params` destructuring

  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    await prisma.note.delete({
      where: { id: parsedId },
    });
    // Return a `204` response without a body
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}
