const { getFinancialAnalytics } = require('./financialEngine');
const db = require('../config/db');

const detectAnomalies = async (userId) => {
  let connection;
  
  try {
    // Fetch financial analytics
    const analytics = await getFinancialAnalytics(userId);
    const { categoryTotals, monthlyData } = analytics;
    
    // Get all transactions for the user
    connection = await db.getConnection();
    const [transactions] = await connection.execute(
      'SELECT id, amount, type, category, created_at FROM transactions WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    
    // Calculate category average monthly spend
    const numberOfMonths = monthlyData.length;
    const categoryAverage = {};
    
    for (const [category, total] of Object.entries(categoryTotals)) {
      categoryAverage[category] = total / numberOfMonths;
    }
    
    // Detect anomalies
    const anomalies = [];
    let totalTransactionsChecked = 0;
    
    transactions.forEach(transaction => {
      totalTransactionsChecked++;
      
      if (transaction.type === 'expense') {
        const avgSpend = categoryAverage[transaction.category] || 0;
        
        // Check if amount exceeds 2x category average
        if (transaction.amount > (2 * avgSpend)) {
          anomalies.push({
            id: transaction.id,
            category: transaction.category,
            amount: transaction.amount,
            created_at: transaction.created_at,
            reason: "Amount exceeds 2x category average"
          });
        }
      }
    });
    
    return {
      totalTransactionsChecked,
      anomalies
    };
    
  } catch (error) {
    console.error('Error detecting anomalies:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

module.exports = { detectAnomalies };