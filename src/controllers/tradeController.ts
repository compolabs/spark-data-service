import { RequestHandler } from "express";
import { Trade } from "../models/Trade";
import { TOKENS_BY_SYMBOL } from "../constants";

export const getLatestTrade: RequestHandler<null> = async (req, res, next) => {
  const filter: Record<string, any> = {};
  if (typeof req.query.symbol === "string") {
    const [symbol0, symbol1] = req.query.symbol.split("/");
    if (TOKENS_BY_SYMBOL[symbol0] != null && TOKENS_BY_SYMBOL[symbol1] != null) {
      filter["$or"] = [
        {
          asset0: TOKENS_BY_SYMBOL[symbol0].assetId,
          asset1: TOKENS_BY_SYMBOL[symbol1].assetId,
        },
        {
          asset0: TOKENS_BY_SYMBOL[symbol1].assetId,
          asset1: TOKENS_BY_SYMBOL[symbol0].assetId,
        },
      ];
    }
  }
  const trades = await Trade.find(filter).sort({ _id: -1 }).limit(50).exec();

  res.send(trades);
};
// export const createTrade: RequestHandler = async (req, res, next) => {
//   const trade = await Trade.create(req.body);
//   res.send(trade);
// };
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
