import { NextResponse } from "next/server";
import dbConnect from "@/config/mongoose";
import User from "@/models/User";
import bcryptjs from "bcryptjs";
import { SignJWT } from "jose";
import { serialize } from "cookie";
import { Types } from "mongoose";

export async function POST(req: Request) {
  const { email, password, role, name } = await req.json();

  try {
    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      role,
      name,
    });
    await newUser.save();

    // Ensure the secret is correctly encoded
    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);

    const token = await new SignJWT({
      userId: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
    })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" }) // Correctly set the protected header
      .setIssuedAt() // Optionally add issued at time
      .setExpirationTime("1d") // Set expiration time
      .sign(secret); // Pass the encoded secret

    const cookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 1 day
      path: "/",
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        token,
        user: { email: newUser.email, role: newUser.role, name: newUser.name },
      },
      { status: 201, headers: { "Set-Cookie": cookie } }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
