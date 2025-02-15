const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  personalInfo: {
    name: String,
    profileImage: String,
    phone: String,
  },
  financials: {
    balance: { type: Number, default: 0 },
    monthlyBudget: Number,
    monthlyExpenses: { type: Number, default: 0 },
    totalSaved: Number,
    incomeSources: [String],
  },
  security: {
    lastLogin: Date,
    loginHistory: [
      {
        timestamp: Date,
        ipAddress: String,
        device: String,
      },
    ],
    trustedDevices: [String],
    isBanned: { type: Boolean, default: false },
  },
  badges: [
    {
      badgeId: { type: mongoose.Schema.Types.ObjectId, ref: "Badge" },
      earnedAt: Date,
    },
  ],
  fraudReports: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TestUser", UserSchema);
