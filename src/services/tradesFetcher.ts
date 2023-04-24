import { LimitOrdersAbi } from "../constants/limitOrdersConstants/LimitOrdersAbi";
import { LimitOrdersAbi__factory } from "../constants/limitOrdersConstants/LimitOrdersAbi__factory";
import { Wallet } from "@fuel-ts/wallet";
import { Provider } from "fuels";
import { Trade, tradeOutputToITrade } from "../models/Trade";
import { contractAddress, nodeUrl, privateKey } from "../config";
import BigNumber from "bignumber.js";
import BN from "../utils/BN";

class TradesFetcher {
  limitOrdersContract: LimitOrdersAbi;
  initialized: boolean = false;

  constructor() {
    const provider = new Provider(nodeUrl);
    const wallet = Wallet.fromPrivateKey(privateKey, provider);
    this.limitOrdersContract = LimitOrdersAbi__factory.connect(contractAddress, wallet);
  }

  private setInitialized = (l: boolean) => (this.initialized = l);
  public init = async () => {
    if (this.initialized) throw new Error("Already initialized");
    if ((await this.getLastTradeFromDb()) == null) await this.fetchAllTrades();
    this.setInitialized(true);
  };

  public fetchNewTrades = async () => {
    const totalTradesAmount = await this.getTradesAmount().then((v) => v.toNumber());
    const functions = this.limitOrdersContract.functions;
    const lastTradeId = await this.getLastTradeFromDb().then((o) => o.id);
    if (lastTradeId === totalTradesAmount) return;
    if (lastTradeId > totalTradesAmount) {
      await Trade.deleteMany().then(this.fetchAllTrades);
      return;
    }

    const length = new BN(totalTradesAmount.toString())
      .minus(lastTradeId)
      .div(10)
      .toDecimalPlaces(0, BigNumber.ROUND_CEIL)
      .toNumber();
    if (length === 0) return;
    const chunks = await Promise.all(
      Array.from({ length }, (_, i) =>
        functions!
          .trades(i * 10)
          .get()
          .then((res) => res.value.filter((v) => v != null && v.id.gt(lastTradeId)))
          .then((res) => res.map(tradeOutputToITrade))
      )
    );
    await Trade.insertMany(chunks.flat().reverse());
  };

  private fetchAllTrades = async () => {
    const tradesAmount = await this.getTradesAmount();
    if (this.limitOrdersContract === null || tradesAmount == null) return;
    const functions = this.limitOrdersContract.functions;
    const length = new BN(tradesAmount.toString())
      .div(10)
      .toDecimalPlaces(0, BigNumber.ROUND_CEIL)
      .toNumber();
    const chunks = await Promise.all(
      Array.from({ length }, (_, i) =>
        functions
          .trades(i * 10)
          .get()
          .then((res) => res.value.filter((v) => v != null))
      )
    );

    await Trade.insertMany(chunks.flat().map(tradeOutputToITrade).flat().reverse());
  };

  private getTradesAmount = () =>
    this.limitOrdersContract.functions
      .trades_amount()
      .simulate()
      .then((res) => res.value)
      .catch((e) => {
        throw new Error(`❌ Cannot get trades amount\n ${e}`);
      });

  private getLastTradeFromDb = () =>
    Trade.find()
      .sort({ id: -1 })
      .limit(1)
      .then((arr) => arr[0]);
}

function sliceIntoChunks<T>(arr: T[], chunkSize: number): T[][] {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

export default TradesFetcher;
