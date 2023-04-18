import { initMongo } from "../src/services/mongoService";
import binanceData from "../src/services/binanceTrades.json";
import { Trade } from "../src/models/Trade";
import { TOKENS_BY_SYMBOL } from "../src/constants";
import BN from "../src/utils/BN";

describe("items", () => {
  beforeAll(() => initMongo());
  it("fill local db with trades from binance", async () => {
    for (let i = 0; i < binanceData.length; i++) {
      const item = binanceData[i];
      //Price = amount1/amount0
      const price = new BN(item.quoteQty).div(item.qty);
      await Trade.create({
        asset0: TOKENS_BY_SYMBOL.BTC.assetId,
        amount0: item.price,
        asset1: TOKENS_BY_SYMBOL.USDC.assetId,
        amount1: item.quoteQty,
        timestamp: item.time,
        price: price.toNumber(),
      });
    }
  }, 500000);
  it("clean db", async () => {
    await Trade.deleteMany();
  }, 500000);
  it("print db", async () => {
    console.log(await Trade.find({}));
  }, 500000);
});
