const db = require('../config/db');

const getDashboardController = async (req, res) => {
  const userId = req.user.id;
  let connection;

  try {
    connection = await db.getConnection();

    // ===============================
    // BASIC TOTALS
    // ===============================

    const [incomeResult] = await connection.execute(
      'SELECT COALESCE(SUM(amount), 0) as total_income FROM transactions WHERE user_id = ? AND type = "income"',
      [userId]
    );

    const [expenseResult] = await connection.execute(
      'SELECT COALESCE(SUM(amount), 0) as total_expense FROM transactions WHERE user_id = ? AND type = "expense"',
      [userId]
    );

    const [countResult] = await connection.execute(
      'SELECT COUNT(*) as transaction_count FROM transactions WHERE user_id = ?',
      [userId]
    );

    const totalIncome = parseFloat(incomeResult[0].total_income) || 0;
    const totalExpense = parseFloat(expenseResult[0].total_expense) || 0;
    const balance = totalIncome - totalExpense;
    const transactionCount = parseInt(countResult[0].transaction_count) || 0;

    // ===============================
    // RECENT TRANSACTIONS
    // ===============================

    const [recentTransactions] = await connection.execute(
      'SELECT id, amount, type, category, description, created_at FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 5',
      [userId]
    );

    const formattedTransactions = recentTransactions.map(t => ({
      id: t.id,
      amount: t.amount,
      type: t.type,
      category: t.category,
      description: t.description,
      createdAt: t.created_at
    }));

    // ===============================
    // MONTHLY FINANCIAL STORY (Last 2 Months)
    // ===============================

    const [lastTwoMonths] = await connection.execute(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        SUM(amount) as total
      FROM transactions
      WHERE user_id = ?
        AND type = 'expense'
        AND created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 2 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month DESC
    `, [userId]);

    let monthlyInsight = null;

    if (lastTwoMonths.length >= 2) {
      const currentMonth = Number(lastTwoMonths[0].total) || 0;
      const previousMonth = Number(lastTwoMonths[1].total) || 0;
      const difference = Math.abs(currentMonth - previousMonth);

      if (currentMonth < previousMonth) {
        monthlyInsight = {
          type: "reduced",
          amount: difference
        };
      } else if (currentMonth > previousMonth) {
        monthlyInsight = {
          type: "increased",
          amount: difference
        };
      }
    }

    // ===============================
    // LIFESTYLE UPGRADE DETECTOR (3 Months Trend)
    // ===============================

    const [lastThreeMonths] = await connection.execute(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        SUM(amount) as total
      FROM transactions
      WHERE user_id = ?
        AND type = 'expense'
        AND created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 3 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC
    `, [userId]);

    let lifestyleUpgrade = false;

    if (lastThreeMonths.length === 3) {
      const m1 = Number(lastThreeMonths[0].total) || 0;
      const m2 = Number(lastThreeMonths[1].total) || 0;
      const m3 = Number(lastThreeMonths[2].total) || 0;

      if (m1 < m2 && m2 < m3) {
        lifestyleUpgrade = true;
      }
    }

    // ===============================
    // FINAL RESPONSE
    // ===============================

    res.json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: {
        totalIncome,
        totalExpense,
        balance,
        transactionCount,
        recentTransactions: formattedTransactions,
        monthlyInsight,
        lifestyleUpgrade
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
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