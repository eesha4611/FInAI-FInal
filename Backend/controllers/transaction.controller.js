const { createTransaction, getUserTransactions } = require('../services/database.service');

const createTransactionController = async (req, res) => {
  const { amount, type, category, description } = req.body;
  const userId = req.user.id;

  // Basic validation
  if (!amount || !type || !category) {
    return res.status(400).json({
      success: false,
      message: 'Amount, type, and category are required',
      data: null
    });
  }

  // Validate amount
  if (isNaN(amount) || parseFloat(amount) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Amount must be a positive number',
      data: null
    });
  }

  // Validate type
  if (!['income', 'expense'].includes(type)) {
    return res.status(400).json({
      success: false,
      message: 'Type must be either income or expense',
      data: null
    });
  }

  try {
    const transaction = await createTransaction(userId, amount, type, category, description);
    
    console.log(`✅ Transaction created: ${type} - ${amount} (${category}) for user ${userId}`);

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: { transaction }
    });
  } catch (error) {
    console.error('❌ Create transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  }
};

const getTransactionsController = async (req, res) => {
  const userId = req.user.id;

  try {
    const transactions = await getUserTransactions(userId);
    
    console.log(`✅ Retrieved ${transactions.length} transactions for user ${userId}`);

    res.json({
      success: true,
      message: 'Transactions retrieved successfully',
      data: { transactions }
    });
  } catch (error) {
    console.error('❌ Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  }
};

const deleteTransactionController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // Basic validation
  if (!id || isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'Valid transaction ID is required',
      data: null
    });
  }

  let connection;
  try {
    connection = await require('../config/db').getConnection();
    
    // First check if transaction belongs to user
    const [transactions] = await connection.execute(
      'SELECT id FROM transactions WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    
    if (transactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found or access denied',
        data: null
      });
    }

    // Delete the transaction
    await connection.execute(
      'DELETE FROM transactions WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    console.log(`✅ Transaction deleted: ID ${id} for user ${userId}`);

    res.json({
      success: true,
      message: 'Transaction deleted successfully',
      data: null
    });
  } catch (error) {
    console.error('❌ Delete transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  createTransactionController,
  getTransactionsController,
  deleteTransactionController
};
