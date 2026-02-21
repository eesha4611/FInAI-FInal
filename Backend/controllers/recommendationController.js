const { getAIRecommendations } = require('../services/recommendationEngine');

const testRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const recommendations = await getAIRecommendations(userId);
    
    res.status(200).json({
      success: true,
      data: recommendations
    });
    
  } catch (error) {
    console.error('Error in testRecommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch AI recommendations'
    });
  }
};

module.exports = { testRecommendations };
