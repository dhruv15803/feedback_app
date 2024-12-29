import express from "express"
import { authenticatedUser } from "../middlewares/auth.middleware.js";
import { createForm, getFormAnalytics, getFormById, updateFormTheme } from "../controllers/form.controller.js";

const router = express.Router();

router.post("/",authenticatedUser,createForm);
router.put("/:formId/theme",authenticatedUser,updateFormTheme);
router.get("/:formId/analytics",authenticatedUser,getFormAnalytics);
router.get("/:formId",getFormById);

export default router;
