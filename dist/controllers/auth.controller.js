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
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { isPasswordStrong, validateEmail } from "../utils/auth.utils.js";
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, profileImageUrl, username } = req.body;
        if (email.trim() === "" || username.trim() === "" || password.trim() === "" || profileImageUrl === "") {
            res.status(400).json({ "success": false, "message": "all fields are necessary" });
            return;
        }
        // validate email , username , password 
        if (!validateEmail(email.trim())) {
            res.status(400).json({ "success": false, "message": "Invalid email" });
            return;
        }
        if (!isPasswordStrong(password.trim())) {
            res.status(400).json({
                "success": false,
                "message": "password should have atleast 6 characters,password should have atleast 1 special character,password should have atleast 1 uppercase character "
            });
            return;
        }
        if (username.trim().length < 3) {
            res.status(400).json({
                "success": false,
                "message": "username should have minimum length of 3",
            });
            return;
        }
        const user = yield User.find({ $or: [{ email: email.trim().toLowerCase() }, { username: username.trim() }] });
        if (user.length > 0) {
            res.status(400).json({ "success": false, "message": "user already exists" });
            return;
        }
        const salt = yield bcrypt.genSalt(10);
        const hashedPassword = yield bcrypt.hash(password, salt);
        const newUser = yield User.create({ email: email.trim().toLowerCase(), username: username.trim(), password: hashedPassword, profileImageUrl: profileImageUrl });
        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
            expiresIn: "2d",
        });
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 1000 * 60 * 60 * 48,
            path: "/"
        }).json({ "sucess": true, "message": "user registered successfully", "user": newUser });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ "success": false, "message": "Something went wrong when registering user" });
    }
});
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (email.trim() == "" || password.trim() == "") {
            res.status(400).json({ "success": false, "message": "email and password are compulsory" });
            return;
        }
        const user = yield User.findOne({ email: email.trim().toLowerCase() });
        if (!user) {
            res.status(400).json({ "success": false, "message": "Invalid email or password" });
            return;
        }
        // user with email exists (check password)
        const isPasswordCorrect = yield bcrypt.compare(password.trim(), user.password);
        if (!isPasswordCorrect) {
            res.status(400).json({ "success": false, "message": "Invalid email or password" });
            return;
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: "2d",
        });
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 1000 * 60 * 60 * 48,
            path: "/"
        }).json({ "sucess": true, "message": "user logged in successfully", "user": user });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ "success": false, "message": "Something went wrong when logging in" });
        return;
    }
});
const getAuthenticatedUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const user = yield User.findById(userId);
        if (!user) {
            res.status(400).json({ "success": false, "message": "invalid user" });
            return;
        }
        res.status(200).json({ "success": true, user });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ "sucess": false, "message": "Something went wrong when getting authenticated user" });
    }
});
export { registerUser, loginUser, getAuthenticatedUser, };
