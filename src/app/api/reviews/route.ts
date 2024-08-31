// api/reviews/index.ts
import dbConnect from "@/config/mongoose";
import Review from "@/models/Review";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  if (req.method === "POST") {
    const { productId, changes } = req.body;
    try {
      const review = new Review({
        productId,
        changes,
        status: "pending",
      });
      await review.save();
      res.status(201).json({ message: "Review submitted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to submit review" });
    }
  }
}
