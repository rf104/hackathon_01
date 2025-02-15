const mongoose = require("mongoose");
const LeaderboardSchema = new mongoose.Schema({
  period: { type: String, enum: ["daily", "weekly", "monthly"] },
  type: { type: String, enum: ["savings", "spending", "reports"] },
  rankings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      score: Number,
    },
  ],
  updatedAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Leaderboard", LeaderboardSchema);
