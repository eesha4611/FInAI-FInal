const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  console.log(" Auth middleware - Checking token");
  
  // Read Authorization header
  const authHeader =
    req.headers.authorization ||
    req.headers.Authorization;

  console.log(" Auth header:", authHeader);

  if (!authHeader) {
    console.log(" No auth header found");
    return res.status(401).json({
      success: false,
      message: "Access token required"
    });
  }

  const token = authHeader.split(' ')[1];

  console.log(" Extracted token:", token ? "Present" : "Missing");

  if (!token) {
    console.log(" Invalid token format - no token after 'Bearer'");
    return res.status(401).json({
      success: false,
      message: "Invalid token format"
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret-key"
    );

    console.log(" Token verified successfully:", decoded);

    // Attach user info to request
    req.user = decoded;

    console.log(" Authenticated user:", decoded);
    next();

  } catch (err) {
    console.error(" JWT Error:", err.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

module.exports = authMiddleware;