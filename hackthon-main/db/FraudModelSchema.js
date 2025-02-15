const mongoose = require("mongoose");
const FraudModelSchema = new mongoose.Schema({
  name: String,
  type: { type: String, enum: ["rule-based", "machine-learning"] },
  version: String,
  accuracy: Number,
  lastUpdated: Date,
  active: { type: Boolean, default: false },
  config: mongoose.Schema.Types.Mixed,
});

module.exports = mongoose.model("Leaderboard", LeaderboardSchema);
