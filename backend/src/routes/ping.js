const express = require('express');
const router = express.Router();

// Simple ping endpoint
router.get('/', (req, res) => {
  res.json({
    message: "Backend API is reachable",
    timestamp: new Date()
  });
});

module.exports = router;
