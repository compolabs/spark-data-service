import mongoose, { Document } from "mongoose";

// TODO
export interface ITrade {
  id: string;
  owner: string;
  asset0: string;
  amount0: string;
  asset1: string;
  amount1: string;
}

export type TradeDocument = Document & ITrade;

const TradeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  owner: { type: String, required: true },
  asset0: { type: String, required: true },
  amount0: { type: String, required: true },
  asset1: { type: String, required: true },
  amount1: { type: String, required: true },
});

export const Trade = mongoose.model<TradeDocument>("Trade", TradeSchema);
