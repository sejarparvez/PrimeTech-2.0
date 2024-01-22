import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;
const prisma = new PrismaClient();

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const token = await getToken({ req, secret });
    if (!token) {
      return new NextResponse("Token not found");
    }

    const id = token.sub;

    const userInfo = await prisma.user.findUnique({
      where: { id },
      select: {
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
        name: true,
        status: true,
        image: true,
        facebook: true,
        twitter: true,
        linkedin: true,
        github: true,
        instagram: true,
        bio: true,
        createdAt: true,
      },
    });
    if (!userInfo) {
      return new NextResponse("User not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(userInfo), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse("Error fetching user", { status: 409 });
  } finally {
    prisma.$disconnect();
  }
}
