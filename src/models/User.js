const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
  rank: {
    type: String,
  },
  totalGamesPlayed: {
    type: Number,
    default: 0,
  },
  totalGamesWon: {
    type: Number,
    default: 0,
  },
  totalGamesLost: {
    type: Number,
    default: 0,
  },
  totalGamesDrawed: {
    type: Number,
    default: 0,
  },
  totalMultiplayerGames: {
    type: Number,
    default: 0,
  },
  totalSingleGames: {
    type: Number,
    default: 0,
  },
  lowestMovesToWin: {
    type: Number,
    default: 0,
  },
  highestMovesToWin: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
