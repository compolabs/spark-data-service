import BN from "../utils/BN";
import BigNumber from "bignumber.js";
import { LimitOrdersAbi } from "../constants/limitOrdersConstants/LimitOrdersAbi";
import { LimitOrdersAbi__factory } from "../constants/limitOrdersConstants/LimitOrdersAbi__factory";
import { Wallet } from "@fuel-ts/wallet";
import { Provider } from "fuels";
import { Order, orderOutputToIOrder } from "../models/Order";
import { contractAddress, nodeUrl, privateKey } from "../config";

class OrdersFetcher {
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
    await this.fetchAllOrders().then(() => this.setInitialized(true));
  };
  //TODO
  public fetchNewOrders = async () => {
    // const ordersAmount = await this.getOrdersAmount();
    // const functions = this.limitOrdersContract.functions;
    // const ordersLength = this.orders.length;
    // if (ordersAmount == null || ordersLength === 0) return;
    // const firstOrderId = this.orders[0].id;
    // const length = new BN(ordersAmount.toString())
    //   .minus(ordersLength)
    //   .div(10)
    //   .toDecimalPlaces(0, BigNumber.ROUND_CEIL)
    //   .toNumber();
    // if (length === 0) return;
    // const chunks = await Promise.all(
    //   Array.from({ length }, (_, i) =>
    //     functions!
    //       .orders(i * 10)
    //       .get()
    //       .then((res) => res.value.filter((v) => v != null && v.id.gt(firstOrderId)))
    //   )
    // );
    // this.orders = [...chunks.flat(), ...this.orders];
  };
  //TODO
  public updateActiveOrders = async () => {
    // const functions = this.limitOrdersContract?.functions;
    // if (functions == null) return;
    // const activeOrders = await Order.find({ status: "Active" });
    // const chunks = sliceIntoChunks(activeOrders, 10).map((chunk) =>
    //   chunk.map((o) => o.id.toString()).concat(Array(10 - chunk.length).fill("0"))
    // );
    // const res = await Promise.all(
    //   chunks.map((chunk) =>
    //     functions
    //       .orders_by_id(chunk as any)
    //       .get()
    //       .then((res) => res.value)
    //   )
    // );
    // res.flat().forEach((order) => {
    //   if (order != null) {
    //     const i = this.orders.findIndex((o) => o.id === order.id.toString());
    //     this.orders[i] = order;
    //   }
    // });
  };

  private fetchAllOrders = async () => {
    const ordersAmount = await this.getOrdersAmount();
    if (this.limitOrdersContract === null || ordersAmount == null) return;
    const functions = this.limitOrdersContract.functions;
    const length = new BN(ordersAmount.toString())
      .div(10)
      .toDecimalPlaces(0, BigNumber.ROUND_CEIL)
      .toNumber();
    const chunks = await Promise.all(
      Array.from({ length }, (_, i) =>
        functions
          .orders(i * 10)
          .get()
          .then((res) => res.value.filter((v) => v != null))
      )
    );
    await Order.insertMany(chunks.flat().map(orderOutputToIOrder));
  };

  private getOrdersAmount = () =>
    this.limitOrdersContract.functions
      .orders_amount()
      .simulate()
      .then((res) => res.value)
      .catch((e) => {
        throw new Error(`❌ Cannot get orders amount\n ${e}`);
      });
}

function sliceIntoChunks<T>(arr: T[], chunkSize: number): T[][] {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

export default OrdersFetcher;
