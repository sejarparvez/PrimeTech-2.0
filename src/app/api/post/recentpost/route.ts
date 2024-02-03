import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const url = new URL(req.url);
    const queryParams = new URLSearchParams(url.search);
    const searchName = queryParams.get("search") || "";
    const response = await prisma.post.findMany({
      take: 5,
      select: {
        title: true,
        category: true,
        coverImage: true,
        updatedAt: true,
        createdAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    if (response.length === 0) {
      return new NextResponse(JSON.stringify({ error: "No posts found" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);

    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
