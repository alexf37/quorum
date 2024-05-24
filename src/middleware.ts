import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { method } = request;
  const { pathname } = request.nextUrl;

  if (method === "HEAD" && pathname.startsWith("/api")) {
    return new Response(null, { status: 200 });
  }

  return NextResponse.next();
}
