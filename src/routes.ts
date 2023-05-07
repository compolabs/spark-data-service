import { Router } from "express";
import * as tradeController from "./controllers/tradeController";
import * as predicateOrderController from "./controllers/predicateOrderController";

const router = Router();

router.get("/", (req, res) => res.send("Server is alive 👌"));

router.get("/orders", predicateOrderController.getPredicateOrders);
router.get("/orderbook", predicateOrderController.getPredicateOrderbook);
router.post("/order", predicateOrderController.createPredicateOrder);

router.get("/trades", tradeController.getLatestTrade);
// router.post("/trades", tradeController.createTrades);

export { router };
