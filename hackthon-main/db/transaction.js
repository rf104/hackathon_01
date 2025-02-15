const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  recipient: String,
  type: { type: String, enum: ["income", "expense"] },
  category: {
    type: String,
    enum: ["food", "utilities", "entertainment", "shopping", "other"],
  },
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["completed", "pending", "blocked"],
    default: "pending",
  },
  metadata: {
    ipAddress: String,
    location: {
      type: { type: String, default: "Point" },
      coordinates: [Number],
    },
    device: String,
  },
  fraudAnalysis: {
    isFraud: Boolean,
    confidence: Number,
    modelUsed: String,
    triggers: [String],
  },
});
module.exports = mongoose.model("Transaction", TransactionSchema);
