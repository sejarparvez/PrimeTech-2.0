import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET;

export async function PUT(req: NextRequest, res: NextResponse) {
  try {
    const token = await getToken({ req, secret });
    if (!token) {
      return new NextResponse("Token not found");
    }

    const data = await req.json();
    const id = token.sub;

    const userInfo = await prisma.user.findUnique({
      where: { id },
      select: {
        password: true,
      },
    });
    if (!userInfo) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Check if the password is not null before comparing
    if (userInfo.password === null) {
      return new NextResponse("User password is null", { status: 500 });
    }

    const isPasswordValid = await bcrypt.compare(
      data.oldPassword,
      userInfo.password,
    );

    if (!isPasswordValid) {
      return new NextResponse("Current password is incorrect", { status: 400 });
    }

    const hashedNewPassword = await bcrypt.hash(data.newPassword, 10);

    await prisma.user.update({
      where: { id },
      data: {
        password: hashedNewPassword,
      },
    });

    return new NextResponse("Password updated successfully");
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("Error updating password", { status: 500 });
  } finally {
    prisma.$disconnect();
  }
}
