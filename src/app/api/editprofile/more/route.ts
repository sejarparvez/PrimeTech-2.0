import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET;

export async function PUT(req: NextRequest, res: NextResponse) {
  try {
    // Retrieve token from the request
    const token = await getToken({ req, secret });
    if (!token) {
      return new NextResponse("Token not found");
    }

    // Parse JSON data from the request body
    const { bio, facebook, twitter, linkedin, instagram, github } =
      await req.json();
    const id = token.sub;

    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Update the user information
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        bio,
        facebook,
        twitter,
        linkedin,
        instagram,
        github,
      },
    });

    // Return the updated user information in the response
    return new NextResponse("User updated", { status: 200 });
  } catch (error) {
    // Handle errors and return an appropriate response
    console.error("Error:", error);
    return new NextResponse("Error updating User", { status: 500 });
  } finally {
    // Disconnect Prisma client after the operation
    await prisma.$disconnect();
  }
}
