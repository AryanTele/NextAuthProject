import mongoose, { Document, Schema, model, Model } from "mongoose";

// Interface representing a User document in MongoDB
export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  role: "admin" | "teamMember"; // Enums to define user roles
  name: string;
  createdAt: Date;
  updatedAt: Date;
  resetPasswordToken?: string; // Optional field for password reset token
  resetPasswordExpires?: Date; // Optional field for token expiry
}

// Mongoose Schema for the User model
const userSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8, // Password should be at least 8 characters
    },
    role: {
      type: String,
      enum: ["admin", "teamMember"], // Restrict values to 'admin' or 'teamMember'
      default: "teamMember", // Default role is team member
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Create or retrieve the User model from the Mongoose connection
const User: Model<IUser> =
  mongoose.models.User || model<IUser>("User", userSchema);

export default User;
