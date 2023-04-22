import mongoose, { Document } from "mongoose";
import { TAI64 } from "tai64";
import { OrderOutput } from "../constants/limitOrdersConstants/LimitOrdersAbi";

export interface IOrder {
  id: number;
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

export const orderOutputToIOrder = (order: OrderOutput) => ({
  id: order.id.toNumber(),
  owner: order.owner.value,
  asset0: order.asset0.value,
  amount0: order.amount0.toString(),
  asset1: order.asset1.value,
  amount1: order.amount1.toString(),
  status: Object.keys(order.status)[0],
  fulfilled0: order.fulfilled0.toString(),
  fulfilled1: order.fulfilled1.toString(),
  timestamp: order.timestamp.toString(),
  matcher_fee: TAI64.fromString(order.matcher_fee.toString()).toUnix(),
  matcher_fee_used: order.matcher_fee_used.toString(),
});

export type OrderDocument = Document & IOrder;

const OrderSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  owner: { type: String, required: true },
  asset0: { type: String, required: true },
  amount0: { type: String, required: true },
  asset1: { type: String, required: true },
  amount1: { type: String, required: true },
  fulfilled0: { type: String, required: true },
  fulfilled1: { type: String, required: true },
  timestamp: { type: String, required: true },
  matcher_fee: { type: Number, required: true },
  matcher_fee_used: { type: String, required: true },
});

export const Order = mongoose.model<OrderDocument>("Order", OrderSchema);
