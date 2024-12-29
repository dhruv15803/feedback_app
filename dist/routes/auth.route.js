import express from "express";
import { getAuthenticatedUser, loginUser, logoutUser, registerUser } from "../controllers/auth.controller.js";
import { authenticatedUser } from "../middlewares/auth.middleware.js";
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", authenticatedUser, getAuthenticatedUser);
router.get("/logout", authenticatedUser, logoutUser);
export default router;
