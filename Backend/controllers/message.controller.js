const getMessage = (req, res) => {
  res.json({
    success: true,
    data: {
      message: "Hello from backend",
      timestamp: new Date().toISOString()
    }
  });
};

module.exports = {
  getMessage
};
