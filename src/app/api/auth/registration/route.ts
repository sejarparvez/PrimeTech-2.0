import { sendVerificationEmail } from "@/components/email/SendVerificationEmail";
import generateVerificationCode from "@/utils/generateVerificationCode";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, password } = data;
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!name || !email || !password) {
      return new NextResponse("Missing name, email, or password", {
        status: 400,
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (existingUser?.emailVerified) {
      return new NextResponse("Email is already registered", { status: 409 });
    } else if (existingUser?.emailVerified === null) {
      // Update the existing user with data from the request
      const updatedUser = await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          name,
          password: hashedPassword,
          emailVerified: null,
          verificationCode: null,
        },
      });

      // Send verification code
      const verificationCode = generateVerificationCode();
      await sendVerificationEmail(email, verificationCode);

      // Save the verification code in the database
      await prisma.user.update({
        where: { id: updatedUser.id },
        data: { verificationCode: verificationCode },
      });

      return new NextResponse(
        JSON.stringify({
          message: "Verification code sent successfully",
          userId: updatedUser.id,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    } else {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          status: "Subscriber",
          password: hashedPassword,
          emailVerified: null,
          verificationCode: null,
        },
      });

      // Send verification code
      const verificationCode = generateVerificationCode();
      await sendVerificationEmail(email, verificationCode);

      // Save the verification code in the database
      await prisma.user.update({
        where: { id: user.id },
        data: { verificationCode: verificationCode },
      });

      return new NextResponse(
        JSON.stringify({
          message: "Verification code sent successfully",
          userId: user.id,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { userId, code } = data;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const verificationCode = code.toString();

    // Check if the verification code matches the one stored in the database
    if (user.verificationCode === verificationCode) {
      // Update user status or perform any other verification logic

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          emailVerified: new Date().toISOString(),
          verificationCode: null,
        },
      });

      return new NextResponse("User verified successfully", { status: 200 });
    } else {
      return new NextResponse("Invalid verification code", { status: 400 });
    }
  } catch (error) {
    console.error("Error during verification:", error);
    return new NextResponse("Internal server error", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
