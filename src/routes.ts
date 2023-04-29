import { Router } from "express";
import * as orderController from "./controllers/orderController";
import * as tradeController from "./controllers/tradeController";
import { getLatestTrade } from "./controllers/tradeController";

const router = Router();

router.get("/", (req, res) => res.send("Server is alive 👌"));

// Order routes
router.get("/orders", orderController.getOrders);
router.get("/orderbook", orderController.getOrderbook);
// router.post("/order", orderController.createOrder);
// router.get("/order/:id", orderController.getOrderById);
// router.put("/order/:id", orderController.updateOrder);
// router.delete("/order/:id", orderController.deleteOrder);

router.get("/trades", tradeController.getLatestTrade);
// router.post("/trades", tradeController.createTrades);

export { router };
