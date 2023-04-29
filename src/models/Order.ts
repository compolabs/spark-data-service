import mongoose, { Document } from "mongoose";

export interface IOrder {
  id: number;
  owner: string;
  asset0: string;
  amount0: string;
  asset1: string;
  amount1: string;
  status: string;
  fulfilled0: string;
  fulfilled1: string;
  timestamp: number;
  matcher_fee: string;
  matcher_fee_used: string;
  type: "SELL" | "BUY";
  price: number;
  market: string;
}

export type OrderDocument = Document & IOrder;

const OrderSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  owner: { type: String, required: true },
  asset0: { type: String, required: true },
  amount0: { type: String, required: true },
  asset1: { type: String, required: true },
  amount1: { type: String, required: true },
  status: { type: String, required: true },
  fulfilled0: { type: String, required: true },
  fulfilled1: { type: String, required: true },
  timestamp: { type: Number, required: true },
  matcher_fee: { type: String, required: true },
  matcher_fee_used: { type: String, required: true },
  market: { type: String, required: true },
  price: { type: Number, required: true },
  type: { type: String, enum: ["SELL", "BUY"], required: true },
});

export const Order = mongoose.model<OrderDocument>("Order", OrderSchema);
