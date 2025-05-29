import express from 'express';
import cors from 'cors';
import useRouter from './Routes/userRoutes.js';
import authRoutes from './Routes/authRoutes.js';
import connectDB from './Config/db.js';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

await connectDB();
app.use(helmet());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());



app.use("/user", useRouter);
app.use("/auth", authRoutes);

app.listen(3000, () => {
  console.log(`server is listening on port 3000!`);
});
