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

    // Example paths; adjust according to your needs
    const url = req.nextUrl.clone();
    if (url.pathname.startsWith("/admin-dashboard")) {
      if (role !== "admin") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    } else if (url.pathname.startsWith("/member-dashboard")) {
      if (role !== "member") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin-dashboard/:path*",
    "/member-dashboard/:path*",
  ],
};
