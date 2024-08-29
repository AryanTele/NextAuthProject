import { NextResponse } from "next/server";
import dbConnect from "@/config/mongoose"; // Adjust the import path as needed
import User from "@/models/User"; // Adjust the import path as needed
import bcryptjs from "bcryptjs";
import { SignJWT } from "jose";

// POST /api/auth/register
export async function POST(req: Request) {
  const { email, password, role, name } = await req.json();

  try {
    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user
    const newUser = new User({
      email,
      password: hashedPassword,
      role,
      name,
    });
    await newUser.save();

    // Generate JWT
    const token = await new SignJWT({
      userId: newUser._id!.toString(), // Ensure _id is a string
      email: newUser.email,
      role: newUser.role,
    })
      .setExpirationTime("1d")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET as string));

    return NextResponse.json(
      {
        message: "User registered successfully",
        token,
        user: { email: newUser.email, role: newUser.role, name: newUser.name },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
