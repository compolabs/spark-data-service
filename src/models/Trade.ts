import mongoose, { Document } from "mongoose";

export interface IOrder {
  id: string;
  owner: string;
  asset0: string;
  amount0: string;
  asset1: string;
  amount1: string;
}

export type OrderDocument = Document & IOrder;

const OrderSchema = new mongoose.Schema({
  id: { type: String, required: true },
  owner: { type: String, required: true },
  asset0: { type: String, required: true },
  amount0: { type: String, required: true },
  asset1: { type: String, required: true },
  amount1: { type: String, required: true },
});

export const Order = mongoose.model<OrderDocument>("Order", OrderSchema);
