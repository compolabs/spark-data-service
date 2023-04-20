import { Router } from "express";
import * as orderController from "./controllers/orderController";
import * as tradeController from "./controllers/tradeController";
import * as twController from "./controllers/twController";
import { getSymbols } from "./controllers/twController";

const router = Router();

router.get("/", (req, res) => res.send("Server is alive 👌"));

// Order routes
router.get("/orders", orderController.getAllOrders);
// router.post("/order", orderController.createOrder);
// router.get("/order/:id", orderController.getOrderById);
// router.put("/order/:id", orderController.updateOrder);
// router.delete("/order/:id", orderController.deleteOrder);

router.get("/trades", tradeController.getAllTrades);
router.post("/trade", tradeController.createTrade);
// router.post("/trades", tradeController.createTrades);

router.get("/config", twController.getConfig);
router.get("/time", twController.getTime);
router.get("/allSymbols", twController.getAllSymbols);
router.get("/symbols", twController.getSymbols);
router.get("/history", twController.getHistory);

export { router };
