import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();

  if (url.pathname === "/no-access") {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const segment = url.pathname.split("/")[1];

  const allowedRoutes = token.accessList;

  const isAdmin = token.role === "ADMIN";

  const accessGranted =
    token.role === "ADMIN" || allowedRoutes.includes(segment as string);

  if (!accessGranted) {
    return NextResponse.redirect(new URL("/no-access", request.url));
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-is-admin", isAdmin ? "true" : "false");
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!$|api|_next/static|_next/image|favicon.ico).*)"],
};
