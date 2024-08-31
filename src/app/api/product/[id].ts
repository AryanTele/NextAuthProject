// api/products/[id].ts
import dbConnect from "@/config/mongoose";
import Product from "@/models/Product";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  const { id } = req.query;
  if (req.method === "GET") {
    try {
      const product = await Product.findById(id);
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  }
}
