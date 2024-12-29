import { Request, Response } from "express"
import { User } from "../models/user.model.js";
import { Form } from "../models/form.model.js";

type CreateFormRequest =  {
    field_title1: string;
    field_title2: string;
    field_title3: string;
    theme?: string;
}

interface UpdateThemeRequest {
    theme: string;
}

const createForm = async (req:Request,res:Response) => {
    try {
        
        const {field_title1,field_title2,field_title3,theme} = req.body as CreateFormRequest;

        const userId = req.userId;
        const user = await User.findOne({_id:userId});
        
        if(!user) {
            res.status(401).json({"success":false,"message":"invalid user id"});
            return;
        }

        if(!field_title1 || !field_title2 || !field_title3) {
            
            res.status(400).json({
                success: false,
                message: "All field titles are required"
            });
            
            return;
        }

        const newForm = await Form.create({
            user_id:user._id,
            field_title1,
            field_title2,
            field_title3,
            theme:theme || 'default'
        });

        res.status(201).json({
            "success":true,
            "message":"Form created successfully",
            form:newForm,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({"success":false,"message":"Internal server error while creating form"});
    }
}


const updateFormTheme = async (req:Request,res:Response) => {
    try {
        const {formId} = req.params;
        const {theme} = req.body as UpdateThemeRequest;
        const userId = req.userId;
    
        
        const user = await User.findOne({_id:userId});    
        if(!user) {
            res.status(401).json({"success":false,"message":"invalid user id"});
            return;
        }
    
        const form = await Form.findOne({_id:formId});
        if(!form) {
            res.status(400).json({"success":false,"message":"form not found"});
            return;
        }
    
        if(!theme) {
            res.status(400).json({
                success: false,
                message: "Theme is required",
            });
            return;
        }


        // user exists , form exists , theme is not empty
        // to update the form  , the user._id == form.user_id (form has to be user's)
        if(user._id.toString()!==form.user_id.toString()) {
            res.status(401).json({"success":false,"message":"user not authorized to edit form"});
            return;
        }
    
        form.theme = theme;
        await form.save();
    
        res.status(200).json({"success":true,"message":"Theme updated successfully",form});
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error while updating theme",
        });
    }
}

export {
    createForm,
    updateFormTheme,
}