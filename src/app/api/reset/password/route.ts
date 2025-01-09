import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { code, email, password } = data;

    if (!code || !email || !password) {
      return new NextResponse("Missing code, email, or password", {
        status: 400,
      });
    }

    if (!code || !email || !password) {
      return new NextResponse("Invalid request data", { status: 400 });
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return new NextResponse("No user found", { status: 404 });
    }

    if (user.emailVerified) {
      if (user.verificationCode === code) {
        await prisma.user.update({
          where: { email },
          data: {
            verificationCode: null,
            password: hashedPassword,
          },
        });
        return new NextResponse("Passwords updated successfully", {
          status: 200,
        });
      } else {
        return new NextResponse("Verification code did not match", {
          status: 400,
        });
      }
    } else {
      return new NextResponse("Email not verified", { status: 400 });
    }
  } catch (error) {
    console.error("Error in PATCH:", error);
    return new NextResponse("Internal server error", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
