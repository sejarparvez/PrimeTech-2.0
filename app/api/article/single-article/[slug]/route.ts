import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { deleteImageFromCloudinary } from '@/utils/cloudinary';

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const { slug } = await params;

    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: true,
        comments: { orderBy: { createdAt: 'desc' } },
        _count: { select: { comments: true, likes: true } },
      },
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(article, { status: 200 });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function POST(_req: NextRequest, { params }: RouteContext) {
  try {
    const { slug } = await params;

    const article = await prisma.article.update({
      where: { slug },
      data: { views: { increment: 1 } },
      select: { views: true },
    });

    return NextResponse.json({ views: article.views }, { status: 200 });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to record view' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    // Find article to get the image ID for cleanup
    const article = await prisma.article.findUnique({
      where: id ? { id } : { slug },
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    if (article.imageId) {
      await deleteImageFromCloudinary(article.imageId);
    }

    // Prisma handles comment/like deletion via Cascade as per your schema
    await prisma.article.delete({
      where: { id: article.id },
    });

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (_error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
