import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    await prisma.note.delete({
      where: { id: parseInt(params.id, 10) },
    });
    return NextResponse.json({ message: 'Note deleted successfully' }, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}
