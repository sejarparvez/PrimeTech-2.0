import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { isAdmin } from '@/lib/auth-utils';
import type { PostStatus } from '@/lib/generated/prisma/enums';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const searchQuery = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const categoryId = searchParams.get('category');

    const skip = (page - 1) * limit;

    const whereClause: {
      title?: { contains: string; mode: 'insensitive' };
      status?: PostStatus;
      categoryId?: string;
    } = {};

    if (searchQuery) {
      whereClause.title = {
        contains: searchQuery,
        mode: 'insensitive',
      };
    }

    if (status && status !== 'ALL') {
      whereClause.status = status as PostStatus;
    }

    if (categoryId && categoryId !== 'all') {
      whereClause.categoryId = categoryId;
    }

    const [totalArticles, articles] = await Promise.all([
      prisma.article.count({ where: whereClause }),
      prisma.article.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          coverImage: true,
          isFeatured: true,
          status: true,
          views: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      data: articles,
      meta: {
        total: totalArticles,
        page,
        limit,
        totalPages: Math.ceil(totalArticles / limit),
        hasMore: page < Math.ceil(totalArticles / limit),
      },
    });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 },
      );
    }

    await prisma.article.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 },
    );
  }
}
