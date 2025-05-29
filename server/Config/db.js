import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


export async function connectDB() {
  await mongoose.connect(process.env.MONGO_DB_URI).then(() => {
    console.log("Database connected Successfully");
  }).catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });
}

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed");
  process.exit(0);
}
);

export default connectDB;



