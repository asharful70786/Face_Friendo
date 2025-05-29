import nodemailer from "nodemailer";
import OTP from "../Models/otpModel.js";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ashrafulmomin2@gmail.com",
    pass: process.env.NODE_MAILER_PASSWORD
  },
});

async function sendMail(email) {
  const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await OTP.findOneAndUpdate(
    { email },
    { otp: otpCode, expiresAt: expiry },
    { upsert: true, new: true }
  );

  const htmlContent = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #ffffff; border-radius: 10px; box-shadow: 0 6px 12px rgba(0,0,0,0.1); color: #333;">
      <h2 style="color: #007bff;">🔐 FaceFriendiya - OTP Verification</h2>
      <p>Hi there,</p>
      <p>Use the OTP below to complete your verification process:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 36px; font-weight: bold; background: #f1f1f1; padding: 14px 28px; border-radius: 8px; display: inline-block; letter-spacing: 5px; color: #222;">
          ${otpCode}
        </span>
      </div>
      <p>This OTP is valid for <strong>10 minutes</strong>.</p>
      <p>If you did not request this OTP, please ignore this message.</p>
      <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
      <footer style="font-size: 0.85em; text-align: center; color: #888;">
        ❤️ With love from <strong>FaceFriendiya</strong><br>
        <a href="https://ashraful.in" style="color: #007bff; text-decoration: none;">Visit our website</a>
      </footer>
    </div>
  `;

  const info = await transporter.sendMail({
    from: '"FaceFriendiya " <ashrafulmomin2@gmail.com>',
    to: email,
    subject: "Your OTP for FaceFriendiya Login",
    html: htmlContent,
  });

}

export default sendMail;


//for send a beautiful email i take help of chatgpt