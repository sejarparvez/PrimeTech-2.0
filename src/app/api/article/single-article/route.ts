import { Prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const queryParams = new URLSearchParams(url.search);
    const id = queryParams.get("id");

    if (!id) {
      return new NextResponse("Missing field", { status: 400 });
    }

    // Fetch the design
    const design = await Prisma.post.findUnique({
      where: {
        id: id,
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },

        comments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!design) {
      return new NextResponse("Design not found", { status: 404 });
    }

    // Add like and comments count to the response object
    const enhancedResponse = {
      ...design,
      commentsCount: design.comments.length,
    };

    return new NextResponse(JSON.stringify(enhancedResponse), { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    Prisma.$disconnect();
  }
}
