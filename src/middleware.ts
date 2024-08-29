import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const url = request.nextUrl.clone();

  if (url.pathname.startsWith("/dashboard")) {
    if (!token) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
      if (url.pathname === "/dashboard/admin" && decoded.role !== "admin") {
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
      if (url.pathname === "/dashboard/team" && decoded.role !== "teamMember") {
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    } catch (error) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
