const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Scan = require("./models/scan");
const Report = require("./models/Report");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));
// Home Route
app.get("/", (req, res) => {
  res.send("AI Scam Detector Backend Running");
});

// Analyze Route
app.post("/analyze", async (req, res) => {
  try {
    console.log("Received:", req.body);

    const message = req.body.message.toLowerCase();

    let score = 0;

    const scamWords = [
      "otp",
      "bank",
      "account",
      "winner",
      "prize",
      "password",
      "login",
      "blocked",
      "hacked"
    ];

    scamWords.forEach(word => {
      if (message.includes(word)) {
        score++;
      }
    });

    const result =
      score >= 3 ? "High Risk Scam" :
      score >= 1 ? "Suspicious" :
      "Safe";

    const scan = new Scan({
      message,
      riskScore: score,
      result
    });

    await scan.save();

    console.log("Saved to MongoDB");

    res.json({
      riskScore: score,
      result
    });

  } catch (err) {
    console.error("Analyze Error:", err);
    res.status(500).json({
      error: err.message
    });
  }
});

// History Route
app.get("/history", async (req, res) => {
  try {
    const scans = await Scan.find()
      .sort({ createdAt: -1 });

    res.json(scans);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message
    });
  }
});


app.post("/report", async (req, res) => {

    try {

        console.log("REPORT RECEIVED:", req.body);

        const { message, category } = req.body;

        const report = new Report({
            message,
            category
        });

        await report.save();

        res.json({
            success: true,
            message: "Scam reported successfully"
        });

    } catch(err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

});
app.get("/debug", (req, res) => {
    res.send("NEW SERVER VERSION");
});
// Start Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
