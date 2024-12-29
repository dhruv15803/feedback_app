import { Request, Response } from "express";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
import { isPasswordStrong, validateEmail } from "../utils/auth.utils.js";

type RegisterUserRequest = {email:string;username:string;password:string;profileImageUrl:string}
type LoginUserRequest = {email:string,password:string}

const registerUser = async (req:Request,res:Response) => {
    try {
        const  {email,password,profileImageUrl,username} = req.body as RegisterUserRequest;

        if(email.trim()==="" ||  username.trim()==="" || password.trim()==="" || profileImageUrl==="") {
            res.status(400).json({"success":false,"message":"all fields are necessary"});
            return;
        }

        // validate email , username , password 
        if(!validateEmail(email.trim())) {
            res.status(400).json({"success":false,"message":"Invalid email"});
            return;
        }

        if(!isPasswordStrong(password.trim())) {
            res.status(400).json({
                "success":false,
                "message":"password should have atleast 6 characters,password should have atleast 1 special character,password should have atleast 1 uppercase character "
            });
            return;
        }

        if(username.trim().length < 3) {
            res.status(400).json({
                "success":false,
                "message":"username should have minimum length of 3",
            });
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
         path:"/"
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
            path:"/"
        }).json({"sucess":true,"message":"user logged in successfully","user":user});
    } catch (error) {
        console.log(error);
        res.status(500).json({"success":false,"message":"Something went wrong when logging in"});
        return
    }
}


const getAuthenticatedUser = async (req:Request,res:Response) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        if(!user) {
            res.status(400).json({"success":false,"message":"invalid user"});
            return;
        }
        res.status(200).json({"success":true,user});
    } catch (error) {
        console.log(error);
        res.status(500).json({"sucess":false,"message":"Something went wrong when getting authenticated user"});
    }
}

export {
    registerUser,
    loginUser,
    getAuthenticatedUser,
}