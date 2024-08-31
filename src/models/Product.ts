// src/models/Product.ts
import mongoose, { Schema, Document } from "mongoose";

interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  imageUrl: string[];
}

const ProductSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: [String], required: true },
});

const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
export default Product;
