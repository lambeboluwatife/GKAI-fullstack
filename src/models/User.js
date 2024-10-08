const mongoose = require("mongoose");

const userSchema = {
  name: {
    type: String,
    required: [true, "Please enter your name"],
    trim: true,
  },
  username: {
    type: String,
    required: [true, "Please enter your username"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    trim: true,
  },
  profilePicture: {
    type: String,
    required: [true, "Please provide a profile picture"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
};

const User = mongoose.model("User", userSchema);

module.exports = User;
