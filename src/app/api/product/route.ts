// api/products/index.ts
import dbConnect from "@/config/mongoose";
import Product from "@/models/Product";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const products = await Product.find({});
      res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error); // Log the error for debugging
      res.status(500).json({ message: "Failed to fetch products" });
    }
  } else {
    // Return a 405 Method Not Allowed if the method is not GET
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
