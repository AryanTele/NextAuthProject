import mongoose, { Schema, Document, model, models } from "mongoose";
import { IProduct } from "./Product";

export interface IReview extends Document {
  productId: mongoose.Types.ObjectId;
  changes: Partial<IProduct>;
  status: "pending" | "rejected" | "approved";
  author: mongoose.Types.ObjectId;
  adminId?: mongoose.Types.ObjectId;
}

const ReviewSchema: Schema = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  changes: { type: Object, required: true },
  status: {
    type: String,
    enum: ["pending", "rejected", "approved"],
    default: "pending",
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default models.Review || model<IReview>("Review", ReviewSchema);
