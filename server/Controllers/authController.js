import User from "../Models/userModel.js";
import { createSessionAndSetCookie } from "../utils/sessionHandler.js";
import loginWithGoogle from "../Services/loginWithGoogle.js"
import Session from "../Models/sessionModel.js";


export const continueWithGoogle = async (req, res) => {
  const { token } = req.body
  try {
    const userInfo = await loginWithGoogle(token)
    const { name, email, sub, picture } = userInfo
    if (!name || !email) return res.status(400).json({ message: "name and email is required" });
    const user = await User.findOne({ email })
    if (user) {
      await createSessionAndSetCookie(user._id, res);
      return res.status(200).json({ message: "login successfully with google" })
    } else {
      const user = await User.create({ name, email, picture })
      await createSessionAndSetCookie(user._id, res);
      return res.status(200).json({ message: "login successfully with google" })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export const getUserInfo = async (req, res) => {
  const user = req.user;
  try {
    return res.status(200).json({ message: user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export const logout = async (req, res) => {
  const { sid } = req.signedCookies;
  const session = await Session.findById(sid);
  try {
    res.clearCookie("sid");
    await session.deleteOne();
    return res.status(200).json({ message: "logout successfully" })
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
