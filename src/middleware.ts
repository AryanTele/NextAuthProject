import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const url = request.nextUrl.clone();

  console.log("Token from cookies:", token); // Debug log

  if (url.pathname.startsWith("/dashboard")) {
    if (!token) {
      console.log("No token found, redirecting to login");
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
      console.log("Decoded JWT:", decoded); // Debug log

      if (url.pathname === "/dashboard/admin" && decoded.role !== "admin") {
        console.log("User is not admin, redirecting to /dashboard");
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
      if (url.pathname === "/dashboard/team" && decoded.role !== "teamMember") {
        console.log("User is not team member, redirecting to /dashboard");
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    } catch (error: any) {
      console.error("JWT verification failed:", error.message); // Debug log
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
