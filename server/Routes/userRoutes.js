import express from 'express';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import limiter from '../MiddleWares/RateLimitMiddleWare.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { fileURLToPath } from 'url';
import { authMiddleWare } from '../MiddleWares/authMiddleWare.js';
import RoleAuthCheck from '../MiddleWares/RoleAuthCheck.js';
import { login_Via_PhoneNumber, loginViaEmail, registerUsing_Email,
  registerUsing_PhoneNumber,
  //  save_Faces_Descriptor,
    sendEmail_otp, sendOtp_PhoneNumber, uploadImages, verifyEmail_Otp, verifyOTP_PhoneNumber } from '../Controllers/userController.js';




const router = express.Router();


router.post("/user/register/email", limiter, sendEmail_otp);

router.post("/user/verify/email-otp", verifyEmail_Otp)

router.post("/user/register/user-email", registerUsing_Email);


router.post("/user/email-login", limiter, loginViaEmail)

router.post('/user/phone/send-otp', limiter, sendOtp_PhoneNumber);

// Verify OTP
router.post('/user/phone/send-otp', limiter, sendOtp_PhoneNumber);
router.post('/user/phone/verify-otp', verifyOTP_PhoneNumber);
router.post("/user/phone/register",registerUsing_PhoneNumber );
router.post("/user/phone/login/number", login_Via_PhoneNumber);


//admin
// SETUP MULTER FOR FILE UPLOAD
const upload = multer({ storage: multer.memoryStorage() });
const cpUpload = upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'faces', maxCount: 1 },
]);

router.post('/api/upload', authMiddleWare, RoleAuthCheck, cpUpload, uploadImages);


// POST route to save face descriptors
// router.post('/api/save-bulk-face', authMiddleWare, RoleAuthCheck, save_Faces_Descriptor);

export default router;


