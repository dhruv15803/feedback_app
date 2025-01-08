var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { razorpay } from "../index.js";
import crypto from "crypto";
import { User } from "../models/user.model.js";
const AMOUNT_PER_FORM = 90;
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const user = yield User.findOne({ _id: userId });
        if (!user) {
            res.status(400).json({
                success: false,
                message: "User not found"
            });
            return;
        }
        // Create a shorter receipt ID (timestamp in seconds + last 4 chars of userId)
        const timestamp = Math.floor(Date.now() / 1000);
        const shortUserId = userId.slice(-4);
        const receipt = `rcpt_${timestamp}_${shortUserId}`;
        const options = {
            amount: AMOUNT_PER_FORM * 100,
            currency: "INR",
            receipt: receipt, // This will now be under 40 characters
        };
        const order = yield razorpay.orders.create(options);
        res.status(200).json({
            success: true,
            order,
        });
    }
    catch (error) {
        console.error("Order creation error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create order"
        });
    }
});
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        // Verify all required parameters are present
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            res.status(400).json({
                success: false,
                message: "Missing payment verification parameters"
            });
            return;
        }
        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) {
            console.error("Razorpay secret key not found");
            res.status(500).json({
                success: false,
                message: "Payment verification configuration error"
            });
            return;
        }
        // Create the signature verification text
        const text = `${razorpay_order_id}|${razorpay_payment_id}`;
        const generatedSignature = crypto
            .createHmac("sha256", secret)
            .update(text)
            .digest("hex");
        // Verify signature
        const isAuthentic = generatedSignature === razorpay_signature;
        if (isAuthentic) {
            // Verify order details with Razorpay API
            try {
                const order = yield razorpay.orders.fetch(razorpay_order_id);
                const payment = yield razorpay.payments.fetch(razorpay_payment_id);
                if (payment.status === 'captured') {
                    res.status(200).json({
                        success: true,
                        verified: true,
                        message: "Payment verified successfully"
                    });
                    return;
                }
                else {
                    res.status(400).json({
                        success: false,
                        verified: false,
                        message: "Payment not captured"
                    });
                    return;
                }
            }
            catch (error) {
                console.error("Razorpay API verification error:", error);
                res.status(500).json({
                    success: false,
                    verified: false,
                    message: "Failed to verify payment with Razorpay"
                });
                return;
            }
        }
        else {
            res.status(400).json({
                success: false,
                verified: false,
                message: "Invalid payment signature"
            });
            return;
        }
    }
    catch (error) {
        console.error("Payment verification error:", error);
        res.status(500).json({
            success: false,
            verified: false,
            message: "Payment verification failed"
        });
    }
});
export { createOrder, verifyPayment, };
