const { getFinancialAnalytics } = require('./financialEngine');
const { getExpensePrediction } = require('./predictionEngine');

const getAIRecommendations = async (userId) => {
  try {
    // Fetch financial analytics and prediction
    const analytics = await getFinancialAnalytics(userId);
    const prediction = await getExpensePrediction(userId);
    
    const { categoryTotals, averageMonthlyExpense } = analytics;
    const { predictedExpense, confidence, slope } = prediction;
    
    // A) Budget Adjustment
    let budgetSuggestion = null;
    if (predictedExpense > averageMonthlyExpense) {
      const increaseAmount = predictedExpense - averageMonthlyExpense;
      budgetSuggestion = `Consider increasing your next month budget by $${increaseAmount.toFixed(2)} based on spending trends.`;
    }
    
    // B) Alert Threshold
    let alertSuggestion = null;
    if (Object.keys(categoryTotals).length > 0) {
      const highestCategory = Object.entries(categoryTotals).reduce((max, [category, total]) => 
        total > max.total ? { category, total } : max, 
        { category: '', total: 0 }
      );
      const alertThreshold = (highestCategory.total * 0.8) / 12; // Monthly average * 80%
      alertSuggestion = `Set alert threshold for ${highestCategory.category} at $${alertThreshold.toFixed(2)} per month.`;
    }
    
    // C) Savings Opportunity
    let savingsSuggestion = null;
    if (slope > 0) {
      // Find discretionary categories (Food, Entertainment)
      const discretionaryCategories = ['Food', 'Entertainment'];
      const discretionarySpending = discretionaryCategories.reduce((total, category) => 
        total + (categoryTotals[category] || 0), 0
      );
      
      if (discretionarySpending > 0) {
        const savingPotential = discretionarySpending * 0.12; // 12% average of 10-15%
        savingsSuggestion = `Reduce spending in Food/Entertainment by 10-15% to save $${savingPotential.toFixed(2)} monthly.`;
      }
    }
    
    // D) Trend Insight
    let trendInsight = null;
    if (slope !== 0) {
      trendInsight = slope > 0 
        ? "Spending trend increasing - monitor discretionary expenses"
        : "Spending trend decreasing - keep up the good work";
    }
    
    return {
      predictedExpense,
      confidence,
      budgetSuggestion,
      alertSuggestion,
      savingsSuggestion,
      trendInsight
    };
    
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    throw error;
  }
};

module.exports = { getAIRecommendations };