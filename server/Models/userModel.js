import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name field should a string with at least three characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      minlength: 4,
    },
    picture: {
      type: String,
      default: "https://png.pngtree.com/png-clipart/20231019/original/pngtree-user-profile-avatar-png-image_13369989.png"
    },
    phoneNumber: {
      type: Number,
      minlength: 10
    },
    role: {
      type: String,
      enum: ["admin", "user", "manager"],
      default: "user"
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
);

const User = mongoose.model("User", userSchema);
export default User;