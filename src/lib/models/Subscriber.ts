import mongoose, { Schema, model, models } from "mongoose";

const SubscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
  },
  { timestamps: true }
);

export const Subscriber = models.Subscriber || model("Subscriber", SubscriberSchema);
export default Subscriber;
