import mongoose, { Schema, Document } from "mongoose";

export interface IService extends Document {
  name: string;
  category: string;
  price: number;
  description: string;
  icon: string;
  isActive: boolean;
}

const serviceSchema = new Schema<IService>({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: "" },
  icon: { type: String, default: "Shirt" },
  isActive: { type: Boolean, default: true },
});

export const Service = mongoose.model<IService>("Service", serviceSchema);
