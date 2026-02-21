const { getFinancialAnalytics } = require('../services/financialEngine');

const testAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    const analytics = await getFinancialAnalytics(userId);

    res.status(200).json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error("Error in testAnalytics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch financial analytics"
    });
  }
};

module.exports = { testAnalytics };