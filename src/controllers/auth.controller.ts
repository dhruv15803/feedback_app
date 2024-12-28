import { Request, Response } from "express";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

type RegisterUserRequest = {email:string;username:string;password:string;profileImageUrl:string}
type LoginUserRequest = {email:string,password:string}

const registerUser = async (req:Request,res:Response) => {
    try {
        const  {email,password,profileImageUrl,username} = req.body as RegisterUserRequest;

        if(email.trim()==="" ||  username.trim()==="" || password.trim()==="" || profileImageUrl==="") {
            res.status(400).json({"success":false,"message":"all fields are necessary"});
            return;
        }
        
        const user = await User.find({$or:[{email:email.trim().toLowerCase()},{username:username.trim()}]});
        
        if(user.length > 0) {
            res.status(400).json({"success":false,"message":"user already exists"});
            return;
        }
     
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
     
        const newUser = await User.create({email:email.trim().toLowerCase(),username:username.trim(),password:hashedPassword,profileImageUrl:profileImageUrl});
        
        const token = jwt.sign({userId:newUser.id},process.env.JWT_SECRET as string,{
         expiresIn:"2d",
        });
     
        res.cookie("auth_token",token,{
         httpOnly:true,
         secure:process.env.NODE_ENV==="production",
         sameSite:process.env.NODE_ENV==="production" ? "none":"lax",
         maxAge:1000*60*60*48,
        }).json({"sucess":true,"message":"user registered successfully","user":newUser});
    } catch (error) {
        console.log(error);   
        res.status(500).json({"success":false,"message":"Something went wrong when registering user"});
    }
}

const loginUser = async (req:Request,res:Response) => {
    try {
        const {email,password} = req.body as LoginUserRequest;

        if(email.trim()=="" || password.trim()=="") {
            res.status(400).json({"success":false,"message":"email and password are compulsory"});
            return;
        }
    
        const user = await User.findOne({email:email.trim().toLowerCase()});
        if(!user) {
            res.status(400).json({"success":false,"message":"Invalid email or password"});
            return;
        }
    
        // user with email exists (check password)
        const isPasswordCorrect = await bcrypt.compare(password.trim(),user.password);
        if(!isPasswordCorrect) {
            res.status(400).json({"success":false,"message":"Invalid email or password"});
            return;
        }
    
        const token = jwt.sign({userId:user.id},process.env.JWT_SECRET as string,{
            expiresIn:"2d",
        });
    
        res.cookie("auth_token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:process.env.NODE_ENV==="production" ? "none":"lax",
            maxAge:1000*60*60*48,
        }).json({"sucess":true,"message":"user logged in successfully","user":user});
    } catch (error) {
        console.log(error);
        res.status(500).json({"success":false,"message":"Something went wrong when logging in"});
        return
    }
}


export {
    registerUser,
    loginUser
}