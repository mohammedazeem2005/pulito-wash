import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  orderId: mongoose.Types.ObjectId;  // <-- update here
  userId: mongoose.Types.ObjectId;   // <-- update here
  rating: number;
  comment: string;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>({
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true },
  comment: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export const Review = mongoose.model<IReview>("Review", reviewSchema);
