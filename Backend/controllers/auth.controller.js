const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const signup = async (req, res) => {
  const { email, password } = req.body;
  let connection;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
      data: null
    });
  }

  try {
    connection = await db.getConnection();
    
    // Check if user already exists
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'User already exists',
        data: null
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const [result] = await connection.execute(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );

    console.log(`✅ User created: ${email} (ID: ${result.insertId})`);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          id: result.insertId,
          email: email,
          createdAt: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  } finally {
    if (connection) connection.release();
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  let connection;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
      data: null
    });
  }

  try {
    connection = await db.getConnection();
    
    // Find user with proper error handling
    let users;
    try {
      [users] = await connection.execute(
        'SELECT id, email, password FROM users WHERE email = ?',
        [email]
      );
    } catch (queryError) {
      console.error('❌ Database query error:', {
        error: queryError.message,
        code: queryError.code,
        errno: queryError.errno,
        sqlState: queryError.sqlState,
        sql: queryError.sql,
        email: email
      });
      
      // In development, send detailed error info
      const errorResponse = {
        success: false,
        message: 'Database error occurred',
        data: null
      };
      
      if (process.env.NODE_ENV === 'development') {
        errorResponse.details = {
          error: queryError.message,
          code: queryError.code,
          errno: queryError.errno
        };
      }
      
      return res.status(500).json(errorResponse);
    }
    
    if (users.length === 0) {
      console.log(`❌ Login failed: User not found - ${email}`);
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
        data: null
      });
    }

    const user = users[0];

    // Compare password with proper error handling
    let isPasswordValid;
    try {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } catch (bcryptError) {
      console.error('❌ Password comparison error:', {
        error: bcryptError.message,
        email: email,
        userId: user.id
      });
      
      const errorResponse = {
        success: false,
        message: 'Authentication error',
        data: null
      };
      
      if (process.env.NODE_ENV === 'development') {
        errorResponse.details = {
          error: bcryptError.message
        };
      }
      
      return res.status(500).json(errorResponse);
    }
    
    if (!isPasswordValid) {
      console.log(`❌ Login failed: Invalid password - ${email}`);
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
        data: null
      });
    }

    // Generate JWT token with error handling
    let token;
    try {
      token = jwt.sign(
        { 
          id: user.id, 
          email: user.email 
        },
        process.env.JWT_SECRET || 'fallback-secret-key',
        { expiresIn: '1h' }
      );
    } catch (jwtError) {
      console.error('❌ JWT token generation error:', {
        error: jwtError.message,
        email: email,
        userId: user.id
      });
      
      const errorResponse = {
        success: false,
        message: 'Token generation error',
        data: null
      };
      
      if (process.env.NODE_ENV === 'development') {
        errorResponse.details = {
          error: jwtError.message
        };
      }
      
      return res.status(500).json(errorResponse);
    }

    console.log(`✅ User logged in: ${email} (ID: ${user.id})`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          createdAt: new Date().toISOString()
        },
        token: token
      }
    });
  } catch (error) {
    // Catch-all error handler for unexpected errors
    console.error('❌ Unexpected login error:', {
      error: error.message,
      stack: error.stack,
      email: email,
      timestamp: new Date().toISOString()
    });
    
    const errorResponse = {
      success: false,
      message: 'Internal server error',
      data: null
    };
    
    if (process.env.NODE_ENV === 'development') {
      errorResponse.details = {
        error: error.message,
        stack: error.stack
      };
    }
    
    res.status(500).json(errorResponse);
  } finally {
    // Ensure connection is always released, even if errors occur
    try {
      if (connection) connection.release();
    } catch (releaseError) {
      console.error('❌ Connection release error:', releaseError.message);
    }
  }
};

const logout = (req, res) => {
  // Since we're using stateless JWT tokens, we can't invalidate them on the server
  // The client should remove the token from their storage (localStorage, cookies, etc.)
  res.json({
    success: true,
    message: 'Logged out successfully. Please clear token on client.',
    data: null
  });
};

module.exports = {
  signup,
  login,
  logout
};
