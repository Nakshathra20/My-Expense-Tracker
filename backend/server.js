// This is the starting point of the backend.

require("dotenv").config(); // 1. read the .env file FIRST

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const expenseRoutes = require("./routes/expenses");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());          // allow the React website to talk to this server
app.use(express.json());  // allow the server to read JSON sent by React

// A test page: open http://localhost:5000 to check the server works
app.get("/", (req, res) => {
  res.send("Expense Tracker backend is running ✅");
});

// All URLs starting with /api/auth go to routes/auth.js
app.use("/api/auth", authRoutes);
// All URLs starting with /api/expenses go to routes/expenses.js
app.use("/api/expenses", expenseRoutes);

const server = app.listen(PORT, (err) => {
  // Express sends listen failures into this callback, so check before logging success.
  if (err) return;
  console.log("Backend running at http://localhost:" + PORT);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error("Port " + PORT + " is already in use. Change PORT in backend/.env.");
  } else {
    console.error(err);
  }
  process.exit(1);
});