import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const data = await req.json();
    const { name, email, password } = data;

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

    if (existingUser) {
      return new NextResponse("Email is already registered", { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        status: "Subscriber",
        password: hashedPassword,
      },
    });

    const verificationCode = generateVerificationCode();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    if (!email) {
      return new NextResponse("Fill out the required fields", { status: 400 });
    }

    const mailData = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Password Reset Verification Code",
      text: `Your verification code for password reset: ${verificationCode} | Sent from: PrimeTech`,
      html: `<p>Your verification code for creating new user: <strong>${verificationCode}</strong></p><p>Sent from: PrimeTech</p>`,
    };

    // Save the verification code in the database
    await prisma.user.update({
      where: { id: user.id },
      data: { verificationCode: verificationCode },
    });

    const info = await transporter.sendMail(mailData);

    console.log("Message sent successfully", info);

    return new NextResponse("Message sent successfully", { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

function generateVerificationCode() {
  // Generate a random 6-digit code
  return Math.floor(100000 + Math.random() * 900000).toString();
}
