const db = require('../config/db');

const getInsights = async (req, res) => {
  // Get logged-in user id from req.user
  const userId = req.user?.id || req.user?.userId || req.user?.data?.id;

  // If userId is missing, return authentication error
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated"
    });
  }

  let connection;
  try {
    connection = await db.getConnection();
    
    // Fetch all transactions for the user
    const [transactions] = await connection.execute(
      'SELECT amount, type, category FROM transactions WHERE user_id = ?',
      [userId]
    );

    // Calculate totals
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryExpenses = {};

    transactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount);
      if (transaction.type === 'income') {
        totalIncome += amount;
      } else if (transaction.type === 'expense') {
        totalExpense += amount;
        
        // Track expenses by category
        if (!categoryExpenses[transaction.category]) {
          categoryExpenses[transaction.category] = 0;
        }
        categoryExpenses[transaction.category] += amount;
      }
    });

    // Calculate overspending (70% threshold)
    let overspending = false;
    if (totalIncome > 0) {
      overspending = totalExpense > (totalIncome * 0.7);
    }

    // Find top spending category
    let topCategory = null;
    let maxCategoryAmount = 0;
    
    for (const [category, amount] of Object.entries(categoryExpenses)) {
      if (amount > maxCategoryAmount) {
        maxCategoryAmount = amount;
        topCategory = category;
      }
    }

    // Calculate health status
    let healthStatus = "Excellent"; // default for no income/expenses
    
    if (totalIncome > 0) {
      const expenseRatio = totalExpense / totalIncome;
      
      if (expenseRatio < 0.5) {
        healthStatus = "Excellent";
      } else if (expenseRatio >= 0.5 && expenseRatio <= 0.7) {
        healthStatus = "Good";
      } else if (expenseRatio > 0.7 && expenseRatio <= 0.9) {
        healthStatus = "Warning";
      } else if (expenseRatio > 0.9) {
        healthStatus = "Risky";
      }
    }

    console.log(`✅ Insights generated for user ${userId}: Income=${totalIncome}, Expense=${totalExpense}, Status=${healthStatus}`);

    res.json({
      success: true,
      message: 'Insights retrieved successfully',
      data: {
        totalIncome,
        totalExpense,
        overspending,
        topCategory,
        healthStatus
      }
    });

  } catch (error) {
    console.error('❌ Get insights error:', error);
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
  getInsights
};
