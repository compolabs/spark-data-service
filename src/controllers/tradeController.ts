import { RequestHandler } from "express";
import { Trade } from "../models/Trade";

export const getAllTrades: RequestHandler<null> = async (req, res, next) => {
  const trades = await Trade.find({}).exec();
  res.send(trades);
};
export const createTrade: RequestHandler = async (req, res, next) => {
  const trade = await Trade.create(req.body);
  res.send(trade);
};
// export const createTrades: RequestHandler = async (req, res, next) => {
//   const trades = await Trade.insertMany(req.body)
//   // const trades = await Trade.create(req.body);
//   res.send(trades);
// };
// export const getTradeById: RequestHandler = async (req, res, next) => {
//   const trade = await Trade.findById(req.params.id);
//   res.send(trade);
// };
//
// export const updateTrade: RequestHandler = async (req, res, next) => {
//   const trade = await Trade.findByIdAndUpdate(req.params.id, req.body);
//   res.send(trade);
// };
// export const deleteTrade: RequestHandler = async (req, res, next) => {
//   await Trade.findByIdAndDelete(req.params.id);
//   res.send("OK");
// };
