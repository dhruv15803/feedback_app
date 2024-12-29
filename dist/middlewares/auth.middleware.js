var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
const authenticatedUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.auth_token)) {
        res.status(404).json({ "success": false, "message": "auth_token cookie not found" });
        return;
    }
    const token = req.cookies.auth_token;
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedPayload.userId;
    req.userId = userId;
    next();
});
export { authenticatedUser, };
