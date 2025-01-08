import express from "express";
import { createOrder, verifyPayment } from "../controllers/razorpay.controller.js";
import { authenticatedUser } from "../middlewares/auth.middleware.js";
const router = express.Router();
router.post("/create-order", authenticatedUser, createOrder);
router.post("/verify-payment", authenticatedUser, verifyPayment);
export default router;
