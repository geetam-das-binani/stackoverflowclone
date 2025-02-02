import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getOrCreateDb } from "./models/server/dbSetup";
import { getOrCreateStorage } from "./models/server/storageSetup";
export async function middleware(request: NextRequest) {
  await Promise.all([getOrCreateDb(), getOrCreateStorage()]);
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
