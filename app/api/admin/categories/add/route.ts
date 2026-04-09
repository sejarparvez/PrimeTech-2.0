import { auth } from '@/lib/auth';
import { isAdmin } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { slugifyText } from '@/utils/slug';
import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const CreateCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less')
    .trim(),
  description: z.string().max(500).trim().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = CreateCategorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { name, description } = parsed.data;

    const slug = slugifyText(name);

    const existing = await prisma.category.findFirst({
      where: {
        OR: [{ name: { equals: name, mode: 'insensitive' } }, { slug }],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A category with this name or slug already exists' },
        { status: 409 },
      );
    }

    const category = await prisma.category.create({
      data: { name, slug, description },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to add category' },
      { status: 500 },
    );
  }
}
