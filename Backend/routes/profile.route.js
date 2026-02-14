const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');

router.get('/', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Profile retrieved successfully',
    data: { 
      user: req.user 
    }
  });
});

module.exports = router;
