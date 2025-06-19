import twilio from 'twilio';
import User from '../Models/userModel.js';
import fs from 'fs';
import sendMail from '../Services/sendMailOtp.js';
import OTP from '../Models/otpModel.js';
import bcrypt from 'bcrypt';
import { normalizeNumber } from '../utils/normalizeNumber.js';
import { createSessionAndSetCookie } from '../utils/sessionHandler.js';
import UserFace from '../Models/UserFace.js';
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
import { uploadImage } from "../Services/cloudinaryServices.js";


const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;

//phone section 

export const sendOtp_PhoneNumber = async (req, res) => {
  const { phone } = req.body;
  const phoneNumber = normalizeNumber(phone);
  const existingUser = await User.findOne({ phoneNumber });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: 'User already registered. Please login using your phone and password.',
    });
  }
  try {
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verifications.create({ to: phoneNumber, channel: 'sms' });

    return res.json({ success: true, sid: verification.sid });
  } catch (err) {
    console.error('OTP Send Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const verifyOTP_PhoneNumber = async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone) {
    return res.status(400).json({ success: false, error: 'required phone Number ' });
  }
  const phoneNumber = normalizeNumber(phone);

  try {
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Phone number already registered. Please login.' });
    }

    const verificationCheck = await client.verify.v2.services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks.create({ to: phoneNumber, code: otp });

    if (verificationCheck.status === 'approved') {
      return res.status(200).json({ message: "otp verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
  } catch (err) {
    console.error('OTP Verify Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const registerUsing_PhoneNumber = async (req, res) => {
  const { name, phone, password } = req.body;
  try {
    if (!name || !phone || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const phoneNumber = normalizeNumber(phone);
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: "Phone number already registered. Please login." });
    }
    const user = await User.create({ name, phoneNumber, password });
    await createSessionAndSetCookie(user._id, res);
    return res.status(200).json({ message: "Registered and logged in successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Failed to register user" ,error   : error.message });
  }
}

export const login_Via_PhoneNumber = async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ success: false, error: 'Phone number and password are required', });
  }
  const phoneNumber = normalizeNumber(phone);
  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'User not found. Please register first.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Incorrect password',
      });
    }

    await createSessionAndSetCookie(user._id, res);
    return res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};


//email  section 

export const sendEmail_otp = async (req, res) => {
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
}

export const verifyEmail_Otp = async (req, res) => {
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
}


export const registerUsing_Email = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Enter email is not Valid Email Address" })
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: "Password is too weak , it  should contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character." });
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
}

export const loginViaEmail = async (req, res, next) => {
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
}




// cloudinary intregration
export const uploadImages = async (req, res) => {
  try {
    const { faces } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const parsedFaces = JSON.parse(faces); // expected: [{ descriptor, imageIndex }, ...]

    if (!Array.isArray(parsedFaces)) {
      return res.status(400).json({ message: 'Invalid face descriptor data' });
    }

    // Upload all images to Cloudinary
    const uploadResults = await Promise.all(
      req.files.map(file => uploadImage(file))
    );

    const imageUrls = uploadResults.map(img => img.secure_url);

    // Save each face with the corresponding image URL
    for (const face of parsedFaces) {
      const imageUrl = imageUrls[face.imageIndex];
      const newFace = new UserFace({
        name: face.name || "Unknown",
        descriptor: face.descriptor,
        imageUrl,
      });
      await newFace.save();
    }

    return res.status(200).json({
      message: 'Images and face descriptors saved successfully',
      count: parsedFaces.length,
      imageUrls,
    });

  } catch (err) {
    console.error("Upload/Save failed:", err);
    return res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};