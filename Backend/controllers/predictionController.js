const { getExpensePrediction } = require('../services/predictionEngine');

const testPrediction = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const prediction = await getExpensePrediction(userId);
    
    res.status(200).json({
      success: true,
      data: prediction
    });
    
  } catch (error) {
    console.error('Error in testPrediction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch expense prediction'
    });
  }
};

module.exports = { testPrediction };
