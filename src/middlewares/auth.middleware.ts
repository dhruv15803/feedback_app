import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

declare global {
    namespace Express  {
        interface Request {
            userId:string;
        }
    }
}

const authenticatedUser = async (req:Request,res:Response,next:NextFunction) => {
    if(!req.cookies?.auth_token) {
        res.status(404).json({"success":false,"message":"auth_token cookie not found"});
        return;   
    }
    const token:string = req.cookies.auth_token as string;
    const decodedPayload = jwt.verify(token,process.env.JWT_SECRET as string) as {userId:string};
    const userId = decodedPayload.userId;
    req.userId = userId;
    next();
}

export {
    authenticatedUser,
}
