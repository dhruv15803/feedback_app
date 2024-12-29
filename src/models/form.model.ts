import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    field_title1:{
        type:String,
        required:true,
    },
    field_title2:{
        type:String,
        required:true,
    },
    field_title3:{
        type:String,
        required:true,
    },
    theme:{
        type:String,
        default:'default'
    }
},{timestamps:true});


export const Form = mongoose.model('Form',formSchema);
