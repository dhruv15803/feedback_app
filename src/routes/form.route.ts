import express from "express";
import { authenticatedUser } from "../middlewares/auth.middleware.js";
import {
  createForm,
  deleteForm,
  getFormAnalytics,
  getFormById,
  getMyForms,
  updateFormTheme,
} from "../controllers/form.controller.js";

const router = express.Router();

router.post("/", authenticatedUser, createForm);
router.put("/:formId/theme", authenticatedUser, updateFormTheme);
router.get("/:formId/analytics", authenticatedUser, getFormAnalytics);
router.get("/my-forms", authenticatedUser, getMyForms);
router.get("/:formId", getFormById);
router.delete("/:formId", authenticatedUser, deleteForm);
export default router;
