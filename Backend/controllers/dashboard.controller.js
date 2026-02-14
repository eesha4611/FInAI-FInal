const db = require('../config/db');

const getDashboardController = async (req, res) => {
  const userId = req.user.id;
  let connection;

  try {
    connection = await db.getConnection();
    
    // Get total income
    const [incomeResult] = await connection.execute(
      'SELECT COALESCE(SUM(amount), 0) as total_income FROM transactions WHERE user_id = ? AND type = "income"',
      [userId]
    );
    
    // Get total expense
    const [expenseResult] = await connection.execute(
      'SELECT COALESCE(SUM(amount), 0) as total_expense FROM transactions WHERE user_id = ? AND type = "expense"',
      [userId]
    );
    
    // Get recent transactions (last 5)
    const [recentTransactions] = await connection.execute(
      'SELECT id, amount, type, category, description, created_at FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 5',
      [userId]
    );
    
    const totalIncome = parseFloat(incomeResult[0].total_income) || 0;
    const totalExpense = parseFloat(expenseResult[0].total_expense) || 0;
    const balance = totalIncome - totalExpense;
    
    // Format recent transactions
    const formattedTransactions = recentTransactions.map(transaction => ({
      id: transaction.id,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      description: transaction.description,
      createdAt: transaction.created_at
    }));

    console.log(`✅ Dashboard data retrieved for user ${userId}: Income=${totalIncome}, Expense=${totalExpense}, Balance=${balance}`);

    res.json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: {
        totalIncome,
        totalExpense,
        balance,
        recentTransactions: formattedTransactions
      }
    });
  } catch (error) {
    console.error('❌ Dashboard error:', error);
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
  getDashboardController
};
