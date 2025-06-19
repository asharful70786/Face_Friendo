import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required and should be at least three characters"],
      minlength: 3,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // allows either email OR phone login (index )
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
      type: String,
      unique: true,
      // match: [/^\\+\\d{10,15}$/, "Invalid phone number format"]
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});


userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
