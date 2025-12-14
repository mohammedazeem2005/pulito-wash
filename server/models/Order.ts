import mongoose, { Schema, Document } from "mongoose";

// Subdocument interfaces
interface OrderItem {
  garment: string;
  quantity: number;
  price: number;
  serviceType: string;
}

interface Address {
  label: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

// Main Order interface
export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;  // Refers to the User model
  items: OrderItem[];
  status: string;
  subtotal: number;
  discount: number;
  total: number;
  pickupDate: string;
  pickupTime: string;
  deliveryDate: string;
  deliveryTime: string;
  address: Address;
  paymentMethod: string;
  paymentStatus: string;
  couponCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Sub-schemas
const orderItemSchema = new Schema<OrderItem>({
  garment: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  serviceType: { type: String, required: true },
});

const addressSchema = new Schema<Address>({
  label: { type: String },
  street: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  isDefault: { type: Boolean, default: false },
});

// Main schema
const orderSchema = new Schema<IOrder>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: { type: [orderItemSchema], required: true },
  status: { type: String, default: "Order Placed" },
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  pickupDate: { type: String, required: true },
  pickupTime: { type: String, required: true },
  deliveryDate: { type: String, required: true },
  deliveryTime: { type: String, required: true },
  address: { type: addressSchema, required: true },
  paymentMethod: { type: String, default: "Cash on Delivery" },
  paymentStatus: { type: String, default: "pending" },
  couponCode: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Export the model
export const Order = mongoose.model<IOrder>("Order", orderSchema);
