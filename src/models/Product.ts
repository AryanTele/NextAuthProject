import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IProduct extends Document {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
}

const ProductSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
});

export default models.Product || model<IProduct>("Product", ProductSchema);
