

import express from "express"
import { createFormResponse, getFormResponses } from "../controllers/formResponse.controller.js";
import { authenticatedUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/",createFormResponse);
router.get("/:formId",authenticatedUser,getFormResponses);

export default router;

