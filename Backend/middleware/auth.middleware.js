const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required',
      data: null
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key', (err, decoded) => {
    if (err) {
      let errorMessage = 'Invalid token';
      
      if (err.name === 'TokenExpiredError') {
        errorMessage = 'Token expired. Please login again.';
      } else if (err.name === 'JsonWebTokenError') {
        errorMessage = 'Invalid token format';
      } else if (err.name === 'NotBeforeError') {
        errorMessage = 'Token not active yet';
      }
      
      return res.status(401).json({
        success: false,
        error: errorMessage,
        data: null
      });
    }

    req.user = decoded;
    next();
  });
};

module.exports = {
  authenticateToken,
  authMiddleware: authenticateToken
};
