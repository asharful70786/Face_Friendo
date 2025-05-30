import mongoose from "mongoose";

const userFaceSchema = new mongoose.Schema({
  name: String,
  descriptor: [Number],// 128 float values
  imageUrl: String,
});

const UserFace = mongoose.model('UserFace', userFaceSchema);
export default UserFace;
