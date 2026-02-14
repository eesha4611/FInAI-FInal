// Validation middleware for request bodies
const validateRequest = (schema) => {
  return (req, res, next) => {
    const errors = [];
    
    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];
      
      // Check if field is required
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} is required`);
        continue;
      }
      
      // Skip further validation if field is optional and empty
      if (value === undefined || value === null || value === '') {
        continue;
      }
      
      // Type validation
      if (rules.type) {
        if (rules.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.push(`${field} must be a valid email`);
        }
        
        if (rules.type === 'number' && isNaN(value)) {
          errors.push(`${field} must be a number`);
        }
        
        if (rules.type === 'string' && typeof value !== 'string') {
          errors.push(`${field} must be a string`);
        }
      }
      
      // Length validation
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters`);
      }
      
      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${field} must not exceed ${rules.maxLength} characters`);
      }
      
      // Custom validation
      if (rules.validate && typeof rules.validate === 'function') {
        const customError = rules.validate(value);
        if (customError) {
          errors.push(customError);
        }
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        data: {
          errors
        }
      });
    }
    
    next();
  };
};

// Common validation schemas
const schemas = {
  signup: {
    email: { required: true, type: 'email' },
    password: { required: true, type: 'string', minLength: 6 }
  },
  login: {
    email: { required: true, type: 'email' },
    password: { required: true, type: 'string' }
  },
  transaction: {
    amount: { 
      required: true, 
      type: 'number',
      validate: (value) => {
        const num = parseFloat(value);
        if (num <= 0) return 'Amount must be positive';
        return null;
      }
    },
    type: { 
      required: true, 
      type: 'string',
      validate: (value) => {
        if (!['income', 'expense'].includes(value)) return 'Type must be income or expense';
        return null;
      }
    },
    category: { required: true, type: 'string', maxLength: 100 },
    description: { required: false, type: 'string', maxLength: 255 }
  }
};

module.exports = {
  validateRequest,
  schemas
};
