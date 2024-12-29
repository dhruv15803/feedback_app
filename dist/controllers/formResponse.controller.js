var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Form } from "../models/form.model.js";
import { FormResponse } from "../models/formResponse.model.js";
import { User } from "../models/user.model.js";
const createFormResponse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { field1_value, field2_value, field3_value, form_id } = req.body;
        if (!form_id) {
            res.status(400).json({ success: false, message: "Form ID is required" });
            return;
        }
        // 1. check if the form_id actually is a form (so response is a valid response to a form);
        const form = yield Form.findOne({ _id: form_id });
        if (!form) {
            res.status(400).json({ "success": false, "message": "invalid form id" });
            return;
        }
        // form with form_Id exists
        if (field1_value.trim() === "" || field2_value.trim() === "" || field3_value.trim() === "") {
            res.status(400).json({ "success": false, "message": "All fields are compulsory" });
            return;
        }
        // fields and form exists
        // create a response to form
        const formResponse = yield FormResponse.create({ form_id: form._id, field1_value, field2_value, field3_value });
        res.status(201).json({ "success": true, "message": "form response successfull", formResponse });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ "success": false, "message": "internal server error when creating form response" });
    }
});
const getFormResponses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { formId } = req.params;
        const { limit, page } = req.query;
        const userId = req.userId;
        const limitNum = parseInt(limit);
        const pageNum = parseInt(page);
        const skip = pageNum * limitNum - limitNum;
        // this is an authenticated endpoint
        // authenticated user can see responses to his/her form
        // can only read responses if the form belongs to him/her
        const user = yield User.findOne({ _id: userId });
        if (!user) {
            res.status(401).json({ "success": false, "message": "Invalid user" });
            return;
        }
        const form = yield Form.findOne({ _id: formId });
        if (!form) {
            res.status(400).json({ "success": false, "message": "form not found" });
            return;
        }
        if (form.user_id.toString() !== user._id.toString()) {
            res.status(401).json({ "success": false, "message": "user not authorized to read responses to this form" });
            return;
        }
        const formResponses = yield FormResponse
            .find({ form_id: form._id }).skip(skip).limit(limitNum).populate("form_id");
        res.status(200).json({ "success": true, formResponses });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ "success": false, "message": "Internal server error when fetching form responses" });
    }
});
export { createFormResponse, getFormResponses, };
