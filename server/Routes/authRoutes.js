import express from "express"
import limiter from "../MiddleWares/RateLimitMiddleWare.js"
import { authMiddleWare } from "../MiddleWares/authMiddleWare.js"
import Session from "../Models/sessionModel.js";
import { continueWithGoogle, getUserInfo, logout } from "../Controllers/authController.js";

const router = express.Router()


router.post("/google-login", limiter, continueWithGoogle)
router.post("/user-info", authMiddleWare, getUserInfo)
router.post("/logout", logout);


export default router;
