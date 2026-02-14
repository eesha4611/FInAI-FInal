const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

// Load environment variables
require('dotenv').config();

async function testDatabase() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('✅ MySQL connected successfully');

    // Insert dummy user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const [userResult] = await connection.execute(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      ['test@example.com', hashedPassword]
    );
    console.log('✅ Dummy user inserted, ID:', userResult.insertId);

    // Insert dummy transaction
    const [transactionResult] = await connection.execute(
      'INSERT INTO transactions (user_id, amount, type, category, description) VALUES (?, ?, ?, ?, ?)',
      [userResult.insertId, 150.00, 'expense', 'Food', 'Test transaction']
    );
    console.log('✅ Dummy transaction inserted, ID:', transactionResult.insertId);

    // Fetch and log users
    const [users] = await connection.execute('SELECT * FROM users');
    console.log('\n📋 Users in database:');
    console.table(users);

    // Fetch and log transactions
    const [transactions] = await connection.execute('SELECT * FROM transactions');
    console.log('\n📋 Transactions in database:');
    console.table(transactions);

    // Clean up test data
    await connection.execute('DELETE FROM transactions WHERE user_id = ?', [userResult.insertId]);
    await connection.execute('DELETE FROM users WHERE id = ?', [userResult.insertId]);
    console.log('\n🧹 Test data cleaned up');

  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 MySQL connection closed');
    }
  }
}

// Run the test
testDatabase();
