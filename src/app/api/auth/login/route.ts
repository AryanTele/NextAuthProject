import { NextResponse } from "next/server";
import dbConnect from "@/config/mongoose";
import User from "@/models/User";
import bcryptjs from "bcryptjs";
import { serialize } from "cookie";
import { SignJWT } from "jose";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  try {
    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = await new SignJWT({
      userId: user._id,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" }) // Ensure this is called before sign()
      .setExpirationTime("1d")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET as string));

    // Set the cookie
    const cookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 1 day
      path: "/",
    });

    return NextResponse.json(
      {
        message: "Login successful",
        token,
        user: { email: user.email, role: user.role, name: user.name },
      },
      { status: 200, headers: { "Set-Cookie": cookie } }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
