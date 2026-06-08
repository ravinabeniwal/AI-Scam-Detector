const mongoose = require("mongoose");

const ScanSchema = new mongoose.Schema({
  message: String,
  riskScore: Number,
  result: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Scan", ScanSchema);