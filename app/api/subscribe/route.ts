import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawEmail = typeof body.email === 'string' ? body.email.trim() : '';

    if (!rawEmail || !EMAIL_REGEX.test(rawEmail)) {
      return NextResponse.json(
        { message: 'Please provide a valid email address.' },
        { status: 400 },
      );
    }

    const email = rawEmail.toLowerCase();

    const existing = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.status === 'ACTIVE') {
        return NextResponse.json(
          { message: 'This email is already subscribed.' },
          { status: 409 },
        );
      }
      await prisma.subscriber.update({
        where: { id: existing.id },
        data: { status: 'ACTIVE' },
      });
      return NextResponse.json(
        { message: 'Welcome back! You are resubscribed.' },
        { status: 200 },
      );
    }

    await prisma.subscriber.create({
      data: { email },
    });

    return NextResponse.json(
      { message: 'Successfully subscribed!' },
      { status: 200 },
    );
  } catch (_error) {
    return NextResponse.json(
      { message: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
