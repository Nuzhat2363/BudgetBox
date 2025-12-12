const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Temporary in-memory storage
let savedBudget = null;

// Save data route
app.post("/save", (req, res) => {
  savedBudget = req.body;
  console.log("Received budget:", savedBudget);

  return res.json({ success: true, message: "Budget saved successfully" });
});

// Load data route
app.get("/load", (req, res) => {
  return res.json({ success: true, data: savedBudget });
});

// Start server
app.listen(4000, () => {
  console.log("Backend running on http://localhost:4000");
});
