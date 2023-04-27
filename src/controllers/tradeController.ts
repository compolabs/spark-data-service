import { RequestHandler } from "express";
import { Trade } from "../models/Trade";
import { TOKENS_BY_SYMBOL } from "../constants";

export const getAllTrades: RequestHandler<null> = async (req, res, next) => {
  const trades = await Trade.find({}).exec();
  res.send(trades);
};
export const getLatestTradesForPair: RequestHandler<null> = async (req, res, next) => {
  const value = req.params as any;
  const symbol0 = value.symbol0;
  const symbol1 = value.symbol1;
  if (symbol0 == null || symbol1 == null) {
    res.send([]);
    return;
  }
  const trades = await Trade.find({
    $or: [
      {
        asset0: TOKENS_BY_SYMBOL[symbol0].assetId,
        asset1: TOKENS_BY_SYMBOL[symbol1].assetId,
      },
      {
        asset0: TOKENS_BY_SYMBOL[symbol1].assetId,
        asset1: TOKENS_BY_SYMBOL[symbol0].assetId,
      },
    ],
  })
    .sort({ _id: -1 })
    .limit(100)
    .exec();
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
