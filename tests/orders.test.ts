import { initMongo } from "../src/services/mongoService";
import { Order } from "../src/models/Order";

describe("items", () => {
  beforeAll(() => initMongo());

  it("test", async () => {
    // console.log(await Order.count());
    // console.log(await Order.count());
    const sell = await Order.find({ status: "Active", type: "SELL" }).sort({ price: 1 }); //.limit(20);
    let prices = sell.map((o) => o.price);
    console.log("SELL", {
      length: prices.length,
      min: Math.min(...prices),
      max: Math.max(...prices),
    });
    const buy = await Order.find({ status: "Active", type: "BUY" }).sort({ price: -1 }); //.limit(20);
    prices = buy.map((o) => o.price);
    console.log("BUY", {
      length: prices.length,
      min: Math.min(...prices),
      max: Math.max(...prices),
    });
  });
  it("print db", async () => {
    const orders = await Order.find({});
    // console.dir(orders, { maxArrayLength: null });
    console.dir(
      orders.filter((o) => o.id > 100).map((o) => o.id),
      { maxArrayLength: null }
    );
  }, 500000);
  it("drop db", async () => {
    // await Order.deleteMany();
  }, 500000);
});
