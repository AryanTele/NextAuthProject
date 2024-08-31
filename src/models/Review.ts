import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  changes: {
    name: String,
    description: String,
    price: Number,
    images: [String],
  },
  submittedAt: { type: Date, default: Date.now },
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
