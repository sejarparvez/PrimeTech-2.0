import generateVerificationCode from "@/components/helper/GenerateCode";
import sendVerificationEmail from "@/components/helper/SendMail";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const data = await req.json();
    const email = data.email;

    if (!email) {
      return new NextResponse("No email address provided", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    if (user.emailVerified) {
      const verificationCode = generateVerificationCode();
      await sendVerificationEmail(email, verificationCode);

      await prisma.user.update({
        where: { id: user.id },
        data: { verificationCode: verificationCode },
      });

      return new NextResponse("Verification code sent successfully");
    } else {
      return new NextResponse("User's email is not verified", { status: 400 });
    }
  } catch (error) {
    console.error("Error in POST:", error);
    return new NextResponse("Internal server error", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(req: NextRequest, res: NextResponse) {
  try {
    const data = await req.json();
    const { code, email } = data;

    if (!code) {
      return new NextResponse("No verification code provided", { status: 400 });
    }
    if (!email) {
      return new NextResponse("No email provided", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      if (user.emailVerified) {
        if (user.verificationCode === code) {
          return new NextResponse("Verification successful");
        } else {
          return new NextResponse("Verification code did not match", {
            status: 400,
          });
        }
      } else {
        return new NextResponse("Email not verified", { status: 400 });
      }
    } else {
      return new NextResponse("No user found", { status: 404 });
    }
  } catch (error) {
    console.error("Error in PUT:", error);
    return new NextResponse("Internal server error", { status: 500 });
  } finally {
    prisma.$disconnect();
  }
}
