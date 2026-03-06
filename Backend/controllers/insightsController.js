const db = require('../config/db');

const getInsights = async (req, res) => {
  const userId = req.user?.id || req.user?.userId || req.user?.data?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated"
    });
  }

  let connection;

  try {
    connection = await db.getConnection();

    // 🔥 IMPORTANT: Added date field
   const [transactions] = await connection.execute(
  'SELECT amount, type, category, created_at FROM transactions WHERE user_id = ?',
  [userId]
);

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryExpenses = {};

    transactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount);

      if (transaction.type === 'income') {
        totalIncome += amount;
      }

      if (transaction.type === 'expense') {
        totalExpense += amount;

        if (!categoryExpenses[transaction.category]) {
          categoryExpenses[transaction.category] = 0;
        }

        categoryExpenses[transaction.category] += amount;
      }
    });

    // Overspending check
    let overspending = false;
    if (totalIncome > 0) {
      overspending = totalExpense > (totalIncome * 0.7);
    }

    // Top category
    let topCategory = null;
    let maxCategoryAmount = 0;

    for (const [category, amount] of Object.entries(categoryExpenses)) {
      if (amount > maxCategoryAmount) {
        maxCategoryAmount = amount;
        topCategory = category;
      }
    }

    // Financial Health
    let healthStatus = "Excellent";

    if (totalIncome > 0) {
      const expenseRatio = totalExpense / totalIncome;

      if (expenseRatio < 0.5) {
        healthStatus = "Excellent";
      } else if (expenseRatio <= 0.7) {
        healthStatus = "Good";
      } else if (expenseRatio <= 0.9) {
        healthStatus = "Warning";
      } else {
        healthStatus = "Risky";
      }
    }

    // ==============================
    // 📊 Monthly Financial Story
    // ==============================

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let currentMonthExpense = 0;
    let lastMonthExpense = 0;

    transactions.forEach(t => {
      if (t.type === 'expense' && t.created_at) {
        const d = new Date(t.created_at);
        const month = d.getMonth();
        const year = d.getFullYear();

        // Current month
        if (month === currentMonth && year === currentYear) {
          currentMonthExpense += parseFloat(t.amount);
        }

        // Last month calculation
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        if (month === lastMonth && year === lastMonthYear) {
          lastMonthExpense += parseFloat(t.amount);
        }
      }
    });

    let monthlyStory = "Not enough data for monthly comparison.";

    if (lastMonthExpense > 0) {
      if (currentMonthExpense > lastMonthExpense) {
        const diff = currentMonthExpense - lastMonthExpense;
        monthlyStory = `⚠ You spent ₹${diff.toFixed(2)} more than last month. Monitor your expenses carefully.`;
      } else {
        const diff = lastMonthExpense - currentMonthExpense;
        monthlyStory = `🎉 You reduced spending by ₹${diff.toFixed(2)} compared to last month. Great control!`;
      }
    }

    // ==============================
    // 🚀 Lifestyle Upgrade Detector
    // ==============================

    const monthlyTotals = {};

    transactions.forEach(t => {
      if (t.type === 'expense' && t.created_at) {
        const d = new Date(t.created_at);
        const key = `${d.getFullYear()}-${d.getMonth()}`;

        if (!monthlyTotals[key]) {
          monthlyTotals[key] = 0;
        }

        monthlyTotals[key] += parseFloat(t.amount);
      }
    });

    const sortedMonths = Object.entries(monthlyTotals)
      .sort((a, b) => new Date(b[0]) - new Date(a[0]))
      .map(entry => entry[1])
      .slice(0, 3);

    let lifestyleAlert = "Stable spending pattern detected.";

    if (sortedMonths.length === 3) {
      if (
        sortedMonths[2] < sortedMonths[1] &&
        sortedMonths[1] < sortedMonths[0]
      ) {
        lifestyleAlert =
          "🚀 Your spending has increased consistently for 3 months. Possible lifestyle upgrade detected.";
      }
    }

    console.log(`✅ Insights generated for user ${userId}`);

    res.json({
      success: true,
      message: 'Insights retrieved successfully',
      data: {
        totalIncome,
        totalExpense,
        overspending,
        topCategory,
        healthStatus,
        monthlyStory,
        lifestyleAlert
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