import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: false }, // Hashed password for credentials login
    image: { type: String, required: false },
    emailVerified: { type: Date, default: null },
  },
  { timestamps: true }
);

export const User = models.User || model("User", UserSchema);
