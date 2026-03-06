const { detectAnomalies } = require('../services/anomalyEngine');

const generateInsights = (anomalies) => {
  const insights = [];
  
  anomalies.forEach(anomaly => {
    const category = anomaly.category;
    const amount = anomaly.amount;
    
    // Generate category-specific insights
    let message = '';
    let suggestion = '';
    
    switch(category.toLowerCase()) {
      case 'food':
      case 'food & dining':
        message = `Unusual spending detected in Food & Dining`;
        suggestion = `Consider meal planning to reduce food expenses this week.`;
        break;
        
      case 'shopping':
        message = `Shopping expenses are unusually high`;
        suggestion = `Review recent purchases and consider setting a shopping budget.`;
        break;
        
      case 'transportation':
        message = `Transportation costs exceed normal patterns`;
        suggestion = `Consider carpooling or public transport to save on fuel costs.`;
        break;
        
      case 'entertainment':
        message = `Entertainment spending is higher than usual`;
        suggestion = `Look for free or low-cost entertainment alternatives.`;
        break;
        
      default:
        message = `Unusual spending detected in ${category}`;
        suggestion = `Consider reducing spending in ${category} to stay within your budget.`;
    }
    
    // Add budget-specific advice
    if (amount > 1000) {
      suggestion += ` You're approaching your monthly budget limit.`;
    }
    
    insights.push({
      category,
      message,
      suggestion,
      severity: amount > 2000 ? 'high' : amount > 1000 ? 'medium' : 'low',
      amount
    });
  });
  
  // Add general budget insights if multiple anomalies exist
  if (anomalies.length > 2) {
    insights.push({
      category: 'general',
      message: 'Multiple unusual transactions detected',
      suggestion: 'Review your overall spending patterns and consider creating a stricter budget.',
      severity: 'high',
      amount: anomalies.reduce((sum, a) => sum + a.amount, 0)
    });
  }
  
  return insights;
};

const testAnomalies = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const anomalyData = await detectAnomalies(userId);
    const { totalTransactionsChecked, anomalies } = anomalyData;
    
    // Generate intelligent insights
    const insights = generateInsights(anomalies);
    
    res.status(200).json({
      success: true,
      data: {
        totalTransactionsChecked,
        anomalies,
        insights
      }
    });
    
  } catch (error) {
    console.error('Error in testAnomalies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to detect anomalies'
    });
  }
};

module.exports = { testAnomalies };
