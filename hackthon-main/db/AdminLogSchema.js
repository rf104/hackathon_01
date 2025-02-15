const mongoose = require("mongoose");

const AdminLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  action: { type: String, enum: ["ban", "unban", "warning", "system_update"] },
  targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  details: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AdminLog", AdminLogSchema);
