const db = require('../config/db');

// User related functions
const findUserByEmail = async (email) => {
  const connection = await db.getConnection();
  try {
    const [users] = await connection.execute(
      'SELECT id, email, password, created_at FROM users WHERE email = ?',
      [email]
    );
    return users.length > 0 ? users[0] : null;
  } finally {
    connection.release();
  }
};

const createUser = async (email, hashedPassword) => {
  const connection = await db.getConnection();
  try {
    const [result] = await connection.execute(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );
    return {
      id: result.insertId,
      email,
      createdAt: new Date().toISOString()
    };
  } finally {
    connection.release();
  }
};

// Transaction related functions
const createTransaction = async (userId, amount, type, category, description) => {
  const connection = await db.getConnection();
  try {
    const [result] = await connection.execute(
      'INSERT INTO transactions (user_id, amount, type, category, description) VALUES (?, ?, ?, ?, ?)',
      [userId, amount, type, category, description]
    );
    return {
      id: result.insertId,
      userId,
      amount,
      type,
      category,
      description,
      createdAt: new Date().toISOString()
    };
  } finally {
    connection.release();
  }
};

const getUserTransactions = async (userId) => {
  const connection = await db.getConnection();
  try {
    const [transactions] = await connection.execute(
      'SELECT id, amount, type, category, description, created_at FROM transactions WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return transactions.map(transaction => ({
      id: transaction.id,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      description: transaction.description,
      createdAt: transaction.created_at
    }));
  } finally {
    connection.release();
  }
};

module.exports = {
  findUserByEmail,
  createUser,
  createTransaction,
  getUserTransactions
};
