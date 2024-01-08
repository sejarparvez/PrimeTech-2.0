import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  return new NextResponse("api is working", {status: 404});
}
