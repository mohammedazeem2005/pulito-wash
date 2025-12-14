import mongoose, { Schema, Document } from "mongoose";

interface Address {
  label: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "customer" | "admin";
  addresses: Address[];
  createdAt: Date;
}

const addressSchema = new Schema<Address>({
  label: String,
  street: String,
  city: String,
  state: String,
  pincode: String,
  isDefault: Boolean,
});

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
  addresses: [addressSchema],
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model<IUser>("User", userSchema);
