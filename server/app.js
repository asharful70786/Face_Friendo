import express from 'express';
import cors from 'cors';
import path from 'path';
import useRouter from './Routes/userRoutes.js';
import authRoutes from './Routes/authRoutes.js';
import faceRoutes from './Routes/faceRoutes.js';
import connectDB from './Config/db.js';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await connectDB();
app.use(helmet());
app.use(cookieParser(process.env.COOKIE_SECRET));
// https://face-laxious.vercel.app
app.use(cors({
  origin: ["http://localhost:5173", "https://face-laxious.vercel.app"],
  credentials: true
}));
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});


app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.json());

app.use("/", useRouter);
app.use("/auth", authRoutes);
app.use('/api', faceRoutes);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).json({ error: "Something went wrong! Please try again" });
});

app.listen(3000, () => {
  console.log(`server is listening on port 3000!`);
});