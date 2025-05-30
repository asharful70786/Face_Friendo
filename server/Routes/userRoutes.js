import express from 'express';
import User from '../Models/userModel.js';
import sendMail from '../Services/sendMailOtp.js';
import OTP from '../Models/otpModel.js';
import bcrypt from 'bcrypt';
import twilio from 'twilio';
import { normalizeNumber } from '../utils/normalizeNumber.js';
import { createSessionAndSetCookie } from '../utils/sessionHandler.js';
import limiter from '../MiddleWares/RateLimitMiddleWare.js';

const router = express.Router();
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);




router.post("/register/email", async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) return res.status(400).json({ message: "name and email is required" });
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Enter email is not Valid Email Address" });
  }

  const user = await User.findOne({ email });
  if (user) return res.status(400).json({ message: "user already exist" });
  try {
    await sendMail(email);
    return res.status(200).json({ message: "email sent successfully" });
  } catch (error) {
    console.log(`error in sending email ${error}`);
    return res.status(500).json({ message: "something went wrong" });
  }
});

router.post("/verify/email-otp", async (req, res) => {
  try {
    const { email, otp } = req.body
    if (!otp || !email) return res.status(400).json({ message: "otp and email is required" })
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Enter email is not Valid Email Address" })
    }
    const record = await OTP.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({ message: "Invalid OTP or expired" });
    }
    record.verifiedByOtp = true;
    await record.save();

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Failed to verify OTP" });
  }
})

router.post("/register/user-email", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Enter email is not Valid Email Address" })
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: "Password is too weak" });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "user already exist" });
    const verified = await OTP.findOne({ email });
    // checking if email is verified
    if (!verified) {
      return res.status(400).json({ message: "Please verify your email with OTP first." });
    }
    //  checking  if it otp  was verified
    if (!verified.verifiedByOtp) {
      return res.status(400).json({ message: "OTP is not verified yet." });
    }
    const hashedPassword = bcrypt.hashSync(password.toString(), 10);
    await User.create({ name, email, password: hashedPassword });
    await OTP.deleteOne({ email });
    return res.status(200).json({ message: "user registered successfully" })
  } catch (error) {
    console.log(`error in registering user ${error.message}`);
    return res.status(500).json({ message: "something went wrong" });
  }
})


router.post("/email-login", limiter, async (req, res, next) => {
  const { sid } = req.signedCookies;
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "email and password is required" });
  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "invalid credentials" });
    const isMatch = await bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "invalid credentials" });
    await createSessionAndSetCookie(user._id, res);
    return res.status(200).json({ message: "login successfully" })

  } catch (error) {
    next(error)
    return res.status(500).json({ message: error.message });
  }
})


// Send OTP to phone number
router.post('/phone/send-otp', limiter, async (req, res) => {
  const { phone, email } = req.body;
  if (!phone || !email) return res.status(400).json({ success: false, error: 'phone number & email must be required' });
  const phoneNumber = normalizeNumber(phone);

  const existingUser = await User.findOne({ $or: [{ phoneNumber }, { email }] });
  if (existingUser) {
    return res.status(400).json({ success: false, error: 'User already registered. Please login using your phone and email.' });
  }
  try {

    const verification = await client.verify.v2.services(process.env.TWILIO_VERIFY_SID)
      .verifications
      .create({ to: phoneNumber, channel: 'sms' });
    return res.json({ success: true, sid: verification.sid });
  } catch (err) {
    console.error('OTP Send Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Verify OTP
router.post('/phone/verify-otp', async (req, res) => {
  const { phone, code, email, name } = req.body

  if (!phone || !code || !email) return res.status(400).json({ success: false, error: 'phone number  , email & code are required' });
  const phoneNumber = normalizeNumber(phone);
  try {
    const existingUser = await User.findOne({ $or: [{ phoneNumber }, { email }] });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'phone number already exists' });
    }
    const verificationCheck = await client.verify.v2.services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks
      .create({ to: phoneNumber, code });

    if (verificationCheck.status === 'approved') {
      let user = await User.create({ phoneNumber, email, name });
      await createSessionAndSetCookie(user._id, res);
      return res.status(200).json({ message: "login successfully" })
    } else {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
  } catch (err) {
    console.error('OTP Verify Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/phone/login/number", limiter, async (req, res) => {
  const { phone, email } = req.body;
  if (!phone || !email) return res.status(400).json({ success: false, error: 'phone number & email must be required' });
  const phoneNumber = normalizeNumber(phone);
  try {

    const user = await User.findOne({ $or: [{ phoneNumber }, { email }] });
    if (!user) return res.status(400).json({ success: false, error: 'user not found try to register instead' });
    await createSessionAndSetCookie(user._id, res);
    return res.status(200).json({ message: "login successfully" })
  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;


