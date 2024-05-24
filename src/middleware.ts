import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  if (request.method === "HEAD") {
    return NextResponse.redirect(new URL(request.url).host);
  }
  return NextResponse.next();
}
