const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const { createTransactionController, getTransactionsController, deleteTransactionController } = require('../controllers/transaction.controller');
const { validateRequest, schemas } = require('../middleware/validation.middleware');

// Apply auth middleware to all transaction routes
router.use(authMiddleware);

router.post('/', validateRequest(schemas.transaction), createTransactionController);
router.get('/', getTransactionsController);
router.delete('/:id', deleteTransactionController);

module.exports = router;
