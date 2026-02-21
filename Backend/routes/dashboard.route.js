const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { getDashboardController, getCategorySummaryController } = require('../controllers/dashboard.controller');

// Apply auth middleware
router.use(authMiddleware);

// GET /api/dashboard - Get dashboard data
router.get('/', getDashboardController);

// GET /api/dashboard/category-summary - Get category summary
router.get('/category-summary', getCategorySummaryController);

module.exports = router;
