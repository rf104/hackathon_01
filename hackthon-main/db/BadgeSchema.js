const mongoose = require("mongoose");
const BadgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  icon: String,
  criteria: {
    conditionType: String,
    threshold: Number,
    description: String,
  },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Badge", BadgeSchema);
