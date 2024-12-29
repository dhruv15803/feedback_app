import { Request ,Response } from "express";
import { Form } from "../models/form.model.js";
import { FormResponse } from "../models/formResponse.model.js";
import { User } from "../models/user.model.js";


type CreateFormResponseBody = {
    form_id:string;
    field1_value:string;
    field2_value:string;
    field3_value:string;
}

const createFormResponse = async (req:Request,res:Response) => {
    try {
        const {field1_value,field2_value,field3_value,form_id} = req.body as CreateFormResponseBody;    

        if (!form_id) {
            res.status(400).json({ success: false, message: "Form ID is required" });
            return;
        }

        // 1. check if the form_id actually is a form (so response is a valid response to a form);
        const form = await Form.findOne({_id:form_id});
        if(!form) {
            res.status(400).json({"success":false,"message":"invalid form id"});
            return;
        }
    
        // form with form_Id exists
        if(field1_value.trim()==="" || field2_value.trim()==="" || field3_value.trim()==="") {
            res.status(400).json({"success":false,"message":"All fields are compulsory"});
            return;
        }
    
        // fields and form exists
        // create a response to form
        const formResponse = await FormResponse.create({form_id:form._id,field1_value,field2_value,field3_value});
        res.status(201).json({"success":true,"message":"form response successfull",formResponse});
    } catch (error) {
        console.log(error);
        res.status(500).json({"success":false,"message":"internal server error when creating form response"});
    }
}

const getFormResponses = async (req:Request,res:Response) => {
    try {
        const {formId} = req.params as {formId:string};
        const userId = req.userId;
    
        // this is an authenticated endpoint
        // authenticated user can see responses to his/her form
        // can only read responses if the form belongs to him/her
        const user = await User.findOne({_id:userId});
        if(!user) {
            res.status(401).json({"success":false,"message":"Invalid user"});
            return;
        }
        const form = await Form.findOne({_id:formId});
        if(!form) {
            res.status(400).json({"success":false,"message":"form not found"});
            return;
        }
    
        if(form.user_id.toString()!==user._id.toString()) {
            res.status(401).json({"success":false,"message":"user not authorized to read responses to this form"});
            return;
        }
    
        const formResponses = await FormResponse.find({form_id:form._id}).populate("form_id");
        res.status(200).json({"success":true,formResponses});
    
    } catch (error) {
        console.log(error);
        res.status(500).json({"success":false,"message":"Internal server error when fetching form responses"});
    }
}

export {
    createFormResponse,
    getFormResponses,
}