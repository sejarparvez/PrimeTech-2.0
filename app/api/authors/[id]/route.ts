import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteContext = {
  params: Promise<{ id: string }>;
};

const articleSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  coverImage: true,
  isFeatured: true,
  views: true,
  category: {
    select: {
      name: true,
      slug: true,
    },
  },
  updatedAt: true,
  author: { select: { id: true, name: true, image: true } },
  _count: { select: { comments: true } },
};

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '24', 10);
    const skip = (page - 1) * limit;

    const author = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        image: true,
        bio: true,
      },
    });

    if (!author) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }

    const whereClause = {
      authorId: id,
      status: 'PUBLISHED' as const,
    };

    const [totalArticles, articles] = await Promise.all([
      prisma.article.count({ where: whereClause }),
      prisma.article.findMany({
        where: whereClause,
        select: articleSelect,
        orderBy: { updatedAt: 'desc' },
        take: limit,
        skip,
      }),
    ]);

    return NextResponse.json(
      {
        data: {
          ...author,
          articles,
          meta: {
            total: totalArticles,
            page,
            limit,
            totalPages: Math.ceil(totalArticles / limit),
            hasMore: page < Math.ceil(totalArticles / limit),
          },
        },
      },
      { status: 200 },
    );
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch author' },
      { status: 500 },
    );
  }
}
