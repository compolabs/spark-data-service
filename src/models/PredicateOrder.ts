import mongoose, { Document } from "mongoose";

export interface IPredicateOrder {
  id: number;
  owner: string;
  asset0: string;
  amount0: string;
  asset1: string;
  amount1: string;
  status: string;
  timestamp: number;
}

export type PredicateOrderDocument = Document & IPredicateOrder;

const PredicateOrderSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  owner: { type: String, required: true },
  asset0: { type: String, required: true },
  amount0: { type: String, required: true },
  asset1: { type: String, required: true },
  amount1: { type: String, required: true },
  status: { type: String, required: true },
  timestamp: { type: Number, required: true },
});

export const PredicateOrder = mongoose.model<PredicateOrderDocument>(
  "PredicateOrder",
  PredicateOrderSchema
);
