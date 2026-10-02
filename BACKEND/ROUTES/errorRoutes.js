
const express = require("express");
const {
  analyzeError
} = require("../controllers/errorController");

const router = express.Router();

// Analyze coding errors
router.post("/analyze", analyzeError);

module.exports = router;
