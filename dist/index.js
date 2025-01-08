var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import authRoutes from "./routes/auth.route.js";
import formRoutes from "./routes/form.route.js";
import formResponseRoutes from "./routes/formResponse.route.js";
import Razorpay from "razorpay";
import paymentRoutes from "./routes/payment.route.js";
const app = express();
const port = Number(process.env.PORT);
export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});
const connectToDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield mongoose.connect(`${process.env.MONGODB_URI}/formApp`);
        console.log('DB CONNECTED');
    }
    catch (error) {
        console.error('DB CONNECTION FAILED:- ', error);
    }
});
connectToDb();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use("/auth", authRoutes);
app.use("/form", formRoutes);
app.use("/form-response", formResponseRoutes);
app.use("/payment", paymentRoutes);
app.get("/test", (req, res) => {
    res.status(200).json({ "success": true, "message": "server working" });
});
app.listen(port, () => {
    console.log(`server running at port ${port}`);
});
