require("dotenv").config();

const express = require("express");
const cors = require("cors");
const errorRoutes = require("./routes/errorRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "100kb" }));

// Home route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "DEVFIX backend is running!"
  });
});

// API routes
app.use("/api", errorRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Handle invalid JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON request."
    });
  }

  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal server error."
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`DEVFIX running at http://localhost:${PORT}`);
});
