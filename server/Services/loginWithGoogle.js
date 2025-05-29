import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
dotenv.config();
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = "http://localhost:5173";

const client = new OAuth2Client(clientId, clientSecret, "http://localhost:5173");

const loginWithGoogle = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: clientId,
  });

  const userInfo = ticket.getPayload();

  return userInfo;
}

export default loginWithGoogle;