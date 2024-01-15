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
        name: true,
        status: true,
        image: true,
        socialLink: true,
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
    return new NextResponse("Error fetching user");
  } finally {
    prisma.$disconnect();
  }
}
