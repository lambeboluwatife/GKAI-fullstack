const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  randomNumbers: { type: [Number], required: true },
  moves: [
    {
      guess: [Number],
      killed: Number,
      injured: Number,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  status: { type: String, default: "in-progress" },
  startDate: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Game", gameSchema);
