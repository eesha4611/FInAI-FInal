const { detectAnomalies } = require('../services/anomalyEngine');

const testAnomalies = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const anomalies = await detectAnomalies(userId);
    
    res.status(200).json({
      success: true,
      data: anomalies
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
