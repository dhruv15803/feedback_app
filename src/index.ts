import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express"
import cors from "cors"
import mongoose from "mongoose"
import "dotenv/config"
import authRoutes from "./routes/auth.route.js"
import formRoutes from "./routes/form.route.js"
import formResponseRoutes from "./routes/formResponse.route.js"
import Razorpay from "razorpay";
import paymentRoutes from "./routes/payment.route.js"

const app:Application = express();
const port:number = Number(process.env.PORT);

export const razorpay = new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID || "",
    key_secret:process.env.RAZORPAY_KEY_SECRET || "",
});

const connectToDb = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}/formApp`);
        console.log('DB CONNECTED');
    } catch (error) {
        console.error('DB CONNECTION FAILED:- ',error);
    }
}

connectToDb();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true,
}));


app.use("/auth",authRoutes);
app.use("/form",formRoutes);
app.use("/form-response",formResponseRoutes);
app.use("/payment",paymentRoutes);

app.get("/test",(req:Request,res:Response) => {
    res.status(200).json({"success":true,"message":"server working"})
})


app.listen(port,() => {
    console.log(`server running at port ${port}`)
});

