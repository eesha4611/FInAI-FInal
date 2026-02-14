const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const { getDashboardController } = require('../controllers/dashboard.controller');

// Apply auth middleware
router.use(authMiddleware);

// GET /api/dashboard - Get dashboard data
router.get('/', getDashboardController);

module.exports = router;
