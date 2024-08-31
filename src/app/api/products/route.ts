// src/app/api/products/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/config/mongoose";
import Product from "@/models/Product";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { title, description, price, imageUrl } = await req.json();

    // Debugging output
    console.log("Request body:", { title, description, price, imageUrl });

    // Validate the incoming data
    if (!title || !description || !price || !imageUrl) {
      console.log("Validation failed: Missing fields");
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const newProduct = new Product({
      title,
      description,
      price,
      imageUrl,
    });

    await newProduct.save();
    console.log("Product saved:", newProduct);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("Error saving product:", error.message);
    return NextResponse.json(
      { message: "Failed to add product" },
      { status: 500 }
    );
  }
}
