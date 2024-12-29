import mongoose from "mongoose";

const formResponseSchema = new mongoose.Schema({
    
    form_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Form',
        required:true,
    },
    
    field1_value:{
        type:String,
        required:true,
    },
    
    field2_value:{
        type:String,
        required:true,
    },
    
    field3_value:{
        type:String,
        required:true,
    }
    
},{timestamps:true});

export const FormResponse = mongoose.model('FormResponse',formResponseSchema);

