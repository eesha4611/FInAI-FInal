const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { 
  getTransactionsController, 
  createTransactionController, 
  updateTransactionController, 
  deleteTransactionController 
} = require("../controllers/transaction.controller");

// GET all expenses with authentication
router.get("/", (req, res, next) => {
  console.log(" GET /api/expenses - Request received");
  next();
}, authMiddleware, getTransactionsController);

// POST create new expense
router.post("/", (req, res, next) => {
  console.log(" POST /api/expenses request received");
  console.log(" Headers:", req.headers);
  console.log(" Body:", req.body);
  next();
}, authMiddleware, (req, res, next) => {
  console.log(" Auth middleware passed for POST /api/expenses");
  console.log(" User:", req.user);
  next();
}, createTransactionController);

// PUT update expense by ID
router.put("/:id", authMiddleware, updateTransactionController);

// DELETE expense by ID
router.delete("/:id", authMiddleware, deleteTransactionController);

module.exports = router;