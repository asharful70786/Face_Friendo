import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  verifiedByOtp: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    expires: 600, // 10 minutes
  },

});

const OTP = mongoose.model("Otp", otpSchema);

export default OTP;