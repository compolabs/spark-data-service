import { Router } from "express";
import * as orderController from "./controllers/orderController";

const router = Router();

router.get("/", (req, res) => res.send("Server is alive 👌"));

// Order routes
router.get("/orders", orderController.getAllOrders);
router.post("/order", orderController.createOrder);
// router.get("/order/:id", orderController.getOrderById);
// router.put("/order/:id", orderController.updateOrder);
// router.delete("/order/:id", orderController.deleteOrder);

export { router };
