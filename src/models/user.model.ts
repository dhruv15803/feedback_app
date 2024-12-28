import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
    },
    username:{
        type:String,
        required:true,
        unique:true,
    },
    firstName:{
        type:String
    },
    lastName:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    profileImageUrl:{
        type:String,
        required:true,
    },
},{timestamps:true});

export const User = mongoose.model('User',userSchema);
