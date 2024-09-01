import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET as string)
    );
    const { role } = payload;

    // Clone the URL to modify it
    const url = req.nextUrl.clone();

    if (url.pathname.startsWith("/admin-dashboard")) {
      if (role !== "admin") {
        // Redirect to login if not admin
        return NextResponse.redirect(new URL("/login", req.url));
      }
    } else if (url.pathname.startsWith("/team-dashboard")) {
      if (role !== "teamMember") {
        // Redirect to login if not a team member
        return NextResponse.redirect(new URL("/login", req.url));
      }
    } else if (url.pathname.startsWith("/dashboard")) {
      // Redirect to the appropriate dashboard based on the role
      if (role === "admin") {
        return NextResponse.redirect(
          new URL("ashboard/admin-dashboard", req.url)
        );
      } else if (role === "teamMember") {
        return NextResponse.redirect(
          new URL("dashboard/team-dashboard", req.url)
        );
      } else {
        // Redirect to login if role does not match
        return NextResponse.redirect(new URL("/login", req.url));
      }
    } else {
      // Handle other paths or redirect to login
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/admin-dashboard/:path*",
    "/team-dashboard/:path*",
    "/dashboard/:path*",
  ],
};
