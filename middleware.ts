import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  const restrictedPathsForObserver = [
    "/archive",
    "/settings",
    "/penalty",
    "/cash",
    "/tips",
  ];
  const restrictedPathsForUser = ["/settings", "/cash", "/result"];

  const publicPaths = ["/"];
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (
    restrictedPathsForObserver.some((path) => pathname.startsWith(path)) &&
    token.role === "OBSERVER"
  ) {
    return NextResponse.redirect(new URL("/no-access", req.url));
  }
  if (
    restrictedPathsForUser.some((path) => pathname.startsWith(path)) &&
    token.role === "USER"
  ) {
    return NextResponse.redirect(new URL("/no-access", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
