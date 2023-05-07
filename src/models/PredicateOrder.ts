import mongoose, { Document } from "mongoose";

export interface IPredicateOrder {
  id: string;
  owner: string;
  asset0: string;
  amount0: string;
  asset1: string;
  amount1: string;
  status: string;
  address: string;
  timestamp: number;
  type: "SELL" | "BUY";
  price: number;
  market: string;
}

export type PredicateOrderDocument = Document & IPredicateOrder;

const PredicateOrderSchema = new mongoose.Schema({
  id: { type: String, required: true },
  owner: { type: String, required: true },
  asset0: { type: String, required: true },
  amount0: { type: String, required: true },
  asset1: { type: String, required: true },
  amount1: { type: String, required: true },
  status: { type: String, required: true },
  market: { type: String, required: true },
  address: { type: String, required: true },
  timestamp: { type: Number, required: true },
  price: { type: Number, required: true },
  type: { type: String, enum: ["SELL", "BUY"], required: true },
});

export const PredicateOrder = mongoose.model<PredicateOrderDocument>(
  "PredicateOrder",
  PredicateOrderSchema
);
