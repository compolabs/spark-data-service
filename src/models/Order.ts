import mongoose, { Document } from "mongoose";

export interface IOrder {
  id: string;
  owner: string;
  asset0: string;
  amount0: number;
  asset1: string;
  amount1: number;
  fulfilled0: number;
  fulfilled1: number;
  timestamp: number;
  matcher_fee: number;
  matcher_fee_used: number;
}

export type OrderDocument = Document & IOrder;

const OrderSchema = new mongoose.Schema({
  id: { type: String, required: true },
  owner: { type: String, required: true },
  asset0: { type: String, required: true },
  amount0: { type: String, required: true },
  asset1: { type: String, required: true },
  amount1: { type: String, required: true },
  fulfilled0: { type: String, required: true },
  fulfilled1: { type: String, required: true },
  timestamp: { type: String, required: true },
  matcher_fee: { type: String, required: true },
  matcher_fee_used: { type: String, required: true },
});

export const Order = mongoose.model<OrderDocument>("Order", OrderSchema);
