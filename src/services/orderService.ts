import { BigNumber } from "bignumber.js";
import { Provider, Wallet } from "fuels";
import { CONTRACT_ADDRESSES, NODE_URL } from "../constants";
import { LimitOrdersAbi__factory } from "../contracts";
import { Order } from "../models/Order";
import BN from "../utils/BN";
import { OrderOutput } from "../contracts/LimitOrdersAbi";

export const updateOrdersData = async (): Promise<void> => {
  console.log("tada");
  const wallet = Wallet.fromAddress(this.address, new Provider(NODE_URL));
  const limitOrdersContract = LimitOrdersAbi__factory.connect(
    CONTRACT_ADDRESSES.limitOrders,
    wallet
  );
  const ordersAmount = await limitOrdersContract?.functions
    .orders_amount()
    .get()
    .then((res) => res.value);

  if (limitOrdersContract === null || ordersAmount == null) return;
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
        .then((res) => res.value.filter((v) => v != null).map((v) => new Order(v as OrderOutput)))
    )
  );
  const orders = chunks.flat();
};

// const fetchAllOrders = async () => {
//   let ordersAmount = await this.getOrdersAmount();
//   if (this.limitOrdersContract === null || ordersAmount == null) return;
//   let functions = this.limitOrdersContract.functions;
//   const length = new BN(ordersAmount.toString())
//     .div(10)
//     .toDecimalPlaces(0, BigNumber.ROUND_CEIL)
//     .toNumber();
//   let chunks = await Promise.all(
//     Array.from({ length }, (_, i) =>
//       functions
//         .orders(i * 10)
//         .get()
//         .then((res) => res.value.filter((v) => v != null).map((v) => new Order(v as OrderOutput)))
//     )
//   );
//   this.orders = chunks.flat();
// };

// const fetchNewOrders = async () => {
//   let ordersAmount = await this.getOrdersAmount();
//   let functions = this.limitOrdersContract?.functions;
//   let ordersLength = this.orders.length;
//   if (functions == null || ordersAmount == null || ordersLength === 0) return;
//   let firstOrderId = this.orders[0].id;
//   let length = new BN(ordersAmount.toString())
//     .minus(ordersLength)
//     .div(10)
//     .toDecimalPlaces(0, BigNumber.ROUND_CEIL)
//     .toNumber();
//   if (length === 0) return;
//   let chunks = await Promise.all(
//     Array.from({ length }, (_, i) =>
//       functions!
//         .orders(i * 10)
//         .get()
//         .then((res) =>
//           res.value
//             .filter((v) => v != null && v.id.gt(firstOrderId))
//             .map((v) => new Order(v as OrderOutput))
//         )
//     )
//   );
//   this.orders = [...chunks.flat(), ...this.orders];
// };
//
// const updateActiveOrders = async () => {
//   if (this.orders.length === 0) await this.fetchNewOrders();
//   let functions = this.limitOrdersContract?.functions;
//   if (functions == null) return;
//   const activeOrders = this.orders.filter((o) => o.status.Active != null);
//   const chunks = sliceIntoChunks(activeOrders, 10).map((chunk) =>
//     chunk.map((o) => o.id.toString()).concat(Array(10 - chunk.length).fill("0"))
//   );
//   let res = await Promise.all(
//     chunks.map((chunk) =>
//       functions
//         ?.orders_by_id(chunk as any)
//         .get()
//         .then((res) => res.value)
//     )
//   );
//   res.flat().forEach((order) => {
//     if (order != null) {
//       const i = this.orders.findIndex((o) => o.id === order.id.toString());
//       this.orders[i] = new Order(order);
//     }
//   });
// };
