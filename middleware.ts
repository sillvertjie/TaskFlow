import { NextRequest, NextResponse } from "next/server";

import { verifyToken } from "@/lib/auth/jwt";

const publicRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;

  const isPublicRoute = publicRoutes.includes(pathname);

  if (!token) {
    if (isPublicRoute) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/login", request.url));
  }

  const payload = await verifyToken(token);

  if (!payload) {
    const response = NextResponse.redirect(new URL("/login", request.url));

    response.cookies.delete("token");

    return response;
  }

  if (isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register", "/boards/:path*"],
};
