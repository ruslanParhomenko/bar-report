import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const patchName = url.pathname;
  console.log("PATCH NAME", patchName);

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log("TOKEN", token?.role);

  // token
  const session =
    request.cookies.get("next-auth.session-token") ||
    request.cookies.get("__Secure-next-auth.session-token");
  const isAuthenticated = !!session;

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!$|api|_next/static|_next/image|favicon.ico).*)"],
};
