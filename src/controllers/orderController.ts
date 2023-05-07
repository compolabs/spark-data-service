import { RequestHandler } from "express";
import { Order } from "../models/Order";
import BN from "../utils/BN";
import { TOKENS_BY_ASSET_ID, TOKENS_BY_SYMBOL } from "../constants";
import { PredicateOrder } from "../models/PredicateOrder";

export const getOrders: RequestHandler<null> = async (req, res, next) => {
  const filter: Record<string, string | string[]> = {};

  if (typeof req.query.id === "string") filter["id"] = req.query.id;
  if (typeof req.query.id === "object") filter["id"] = Object.values(req.query.id) as string[];

  if (typeof req.query.owner === "string") filter["owner"] = req.query.owner;
  if (typeof req.query.status === "string") {
    filter["status"] = capitalize(req.query.status.toLowerCase());
  }

  if (typeof req.query.symbol === "string") {
    const [symbol0, symbol1] = req.query.symbol.split("/");
    TOKENS_BY_SYMBOL[symbol0] != null && (filter["asset0"] = TOKENS_BY_SYMBOL[symbol0].assetId);
    TOKENS_BY_SYMBOL[symbol1] != null && (filter["asset1"] = TOKENS_BY_SYMBOL[symbol1].assetId);
  }
  const maxPrice =
    typeof req.query.maxPrice === "string" && typeof req.query.priceDecimal === "string"
      ? BN.formatUnits(req.query.maxPrice, +req.query.priceDecimal)
      : null;
  const minPrice =
    typeof req.query.minPrice === "string" && typeof req.query.priceDecimal === "string"
      ? BN.formatUnits(req.query.minPrice, +req.query.priceDecimal)
      : null;
  const orders = await Order.find(filter)
    .limit(!Number.isNaN(+(req.query.limit ?? 1000)) ? +req.query.limit! : 1000)
    .exec();
  res.send(
    orders.filter((order) => {
      const amount0 = BN.formatUnits(order.amount0, TOKENS_BY_ASSET_ID[order.asset0].decimals);
      const amount1 = BN.formatUnits(order.amount1, TOKENS_BY_ASSET_ID[order.asset1].decimals);
      return (
        (maxPrice != null ? amount1.div(amount0).lte(maxPrice) : true) &&
        (minPrice != null ? amount1.div(amount0).gte(minPrice) : true)
      );
    })
  );
};
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const getOrderbook: RequestHandler = async (req, res, next) => {
  const owner = typeof req.query.address === "string" ? req.query.address : "";
  const market = typeof req.query.symbol === "string" ? req.query.symbol : "";
  const status = "Active";
  const [buy, sell, myOrders] = await Promise.all([
    PredicateOrder.find({ market, status, type: "BUY" }).sort({ price: -1 }).limit(40), //дороже
    PredicateOrder.find({ market, status, type: "SELL" }).sort({ price: 1 }).limit(40), //дешевле
    PredicateOrder.find({ owner, market, status }).sort({ timestamp: -1 }).limit(50),
  ]);

  res.send({ myOrders, orderbook: { buy, sell } });
};
// export const getOrderById: RequestHandler = async (req, res, next) => {
//   const order = await Order.findById(req.params.id);
//   res.send(order);
// };
//
// export const updateOrder: RequestHandler = async (req, res, next) => {
//   const order = await Order.findByIdAndUpdate(req.params.id, req.body);
//   res.send(order);
// };
// export const deleteOrder: RequestHandler = async (req, res, next) => {
//   await Order.findByIdAndDelete(req.params.id);
//   res.send("OK");
// };
