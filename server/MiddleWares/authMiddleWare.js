import Session from "../Models/sessionModel.js";
import User from "../Models/userModel.js";


export const authMiddleWare = async (req, res, next) => {
  try {
    const { sid } = req.signedCookies;

    if (!sid) {
      return res.status(401).json({ success: false, error: "Authentication required (no sid cookie)" });
    }

    const session = await Session.findById(sid);
    if (!session) {
      res.clearCookie("sid");
      return res.status(401).json({ success: false, error: "Invalid or expired session" });
    }

    const user = await User.findById(session.userId).select("-password -__v -_id -isDeleted");
    if (!user) {
      res.clearCookie("sid");
      return res.status(404).json({ success: false, error: "User not found" });
    }
    req.user = user;
    req.session = session;
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

