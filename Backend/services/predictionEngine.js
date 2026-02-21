const { getFinancialAnalytics } = require('./financialEngine');

const getExpensePrediction = async (userId) => {
  try {
    // Get monthly data from financial analytics
    const analytics = await getFinancialAnalytics(userId);
    const monthlyData = analytics.monthlyData;
    
    // Extract expense values only
    const expenses = monthlyData.map(month => month.expense);
    
    if (expenses.length < 2) {
      return {
        predictedExpense: 0,
        slope: 0,
        confidence: 'Low',
        monthsAnalyzed: expenses.length
      };
    }
    
    // Apply Linear Regression
    const n = expenses.length;
    const x = Array.from({length: n}, (_, i) => i + 1); // [1, 2, 3, ..., n]
    const y = expenses;
    
    // Calculate sums needed for linear regression
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((total, xi, i) => total + (xi * y[i]), 0);
    const sumXX = x.reduce((total, xi) => total + (xi * xi), 0);
    
    // Calculate slope (m) and intercept (c)
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Predict next month expense
    const nextMonth = slope * (n + 1) + intercept;
    
    // Calculate confidence level based on months analyzed
    let confidence;
    if (n >= 10) {
      confidence = 'High';
    } else if (n >= 6) {
      confidence = 'Medium';
    } else {
      confidence = 'Low';
    }
    
    return {
      predictedExpense: Math.round(nextMonth * 100) / 100,
      slope: Math.round(slope * 100) / 100,
      confidence,
      monthsAnalyzed: n
    };
    
  } catch (error) {
    console.error('Error getting expense prediction:', error);
    throw error;
  }
};

module.exports = { getExpensePrediction };