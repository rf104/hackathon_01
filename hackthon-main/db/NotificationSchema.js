const mongoose = require("mongoose");
const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["fraud", "bill", "system", "achievement"] },
  content: String,
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Notification", NotificationSchema);
