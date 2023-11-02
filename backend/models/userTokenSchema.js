const mongoose = require("mongoose");

const userTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    token: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// delete the refresh tokens every 30mins
userTokenSchema.index({ createdAt: 1 }, { expires: "7d" });

module.exports = mongoose.model("UserToken", userTokenSchema);
