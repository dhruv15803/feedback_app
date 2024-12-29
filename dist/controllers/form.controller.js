var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { User } from "../models/user.model.js";
import { Form } from "../models/form.model.js";
import { FormResponse } from "../models/formResponse.model.js";
const createForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { field_title1, field_title2, field_title3, theme } = req.body;
        const userId = req.userId;
        const user = yield User.findOne({ _id: userId });
        if (!user) {
            res.status(401).json({ "success": false, "message": "invalid user id" });
            return;
        }
        if (!field_title1 || !field_title2 || !field_title3) {
            res.status(400).json({
                success: false,
                message: "All field titles are required"
            });
            return;
        }
        const newForm = yield Form.create({
            user_id: user._id,
            field_title1,
            field_title2,
            field_title3,
            theme: theme || 'default'
        });
        res.status(201).json({
            "success": true,
            "message": "Form created successfully",
            form: newForm,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ "success": false, "message": "Internal server error while creating form" });
    }
});
const updateFormTheme = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { formId } = req.params;
        const { theme } = req.body;
        const userId = req.userId;
        const user = yield User.findOne({ _id: userId });
        if (!user) {
            res.status(401).json({ "success": false, "message": "invalid user id" });
            return;
        }
        const form = yield Form.findOne({ _id: formId });
        if (!form) {
            res.status(400).json({ "success": false, "message": "form not found" });
            return;
        }
        if (!theme) {
            res.status(400).json({
                success: false,
                message: "Theme is required",
            });
            return;
        }
        // user exists , form exists , theme is not empty
        // to update the form  , the user._id == form.user_id (form has to be user's)
        if (user._id.toString() !== form.user_id.toString()) {
            res.status(401).json({ "success": false, "message": "user not authorized to edit form" });
            return;
        }
        form.theme = theme;
        yield form.save();
        res.status(200).json({ "success": true, "message": "Theme updated successfully", form });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error while updating theme",
        });
    }
});
const getFormAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { formId } = req.params;
        const userId = req.userId;
        const user = yield User.findOne({ _id: userId });
        if (!user) {
            res.status(401).json({ "success": false, "message": "invalid user" });
            return;
        }
        const form = yield Form.findOne({ _id: formId });
        if (!form) {
            res.status(400).json({ "success": false, "message": "form not found" });
            return;
        }
        // can only see analytics for a form if its ur form 
        if (form.user_id.toString() !== user._id.toString()) {
            res.status(401).json({ "success": false, "message": "user cannot read analytics for this form" });
            return;
        }
        // get count of responses for this particular form 
        // that is the total form responses
        const totalFormResponses = yield FormResponse.countDocuments({ form_id: form._id });
        res.status(200).json({ "success": true, totalFormResponses });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ "success": false, "message": "internal server error when getting form analytics" });
    }
});
export { createForm, updateFormTheme, getFormAnalytics, };
