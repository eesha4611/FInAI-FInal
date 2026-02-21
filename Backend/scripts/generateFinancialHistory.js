require('dotenv').config();
const db = require('../config/db');

const generateHistory = async (userId) => {
  let connection;
  
  try {
    connection = await db.getConnection();
    
    const currentDate = new Date();
    let monthlyIncome = 30000;
    
    for (let monthOffset = 11; monthOffset >= 0; monthOffset--) {
      // Calculate the date for this month
      const transactionDate = new Date(currentDate);
      transactionDate.setMonth(currentDate.getMonth() - monthOffset);
      transactionDate.setDate(15); // Set to 15th of each month
      
      const year = transactionDate.getFullYear();
      const month = transactionDate.getMonth() + 1; // JavaScript months are 0-indexed
      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-15 10:00:00`;
      
      console.log(`Generating data for: ${formattedDate}`);
      
      // Add income transaction
      await connection.execute(
        'INSERT INTO transactions (user_id, amount, type, category, description, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, monthlyIncome, 'income', 'Salary', `Monthly salary for ${year}-${month.toString().padStart(2, '0')}`, formattedDate]
      );
      
      // Calculate expense amounts with slight monthly increase
      const monthlyIncrease = (11 - monthOffset) * 50; // Increase by $50 per category per month
      
      // Food expenses (4000–6000 + monthly increase)
      const foodAmount = 5000 + Math.floor(Math.random() * 1000) + monthlyIncrease;
      await connection.execute(
        'INSERT INTO transactions (user_id, amount, type, category, description, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, foodAmount, 'expense', 'Food', `Monthly food expenses for ${year}-${month.toString().padStart(2, '0')}`, formattedDate]
      );
      
      // Transport expenses (1000–2000 + monthly increase)
      const transportAmount = 1500 + Math.floor(Math.random() * 500) + monthlyIncrease;
      await connection.execute(
        'INSERT INTO transactions (user_id, amount, type, category, description, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, transportAmount, 'expense', 'Transport', `Monthly transport expenses for ${year}-${month.toString().padStart(2, '0')}`, formattedDate]
      );
      
      // Entertainment expenses (1500–3000 + monthly increase)
      const entertainmentAmount = 2250 + Math.floor(Math.random() * 750) + monthlyIncrease;
      await connection.execute(
        'INSERT INTO transactions (user_id, amount, type, category, description, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, entertainmentAmount, 'expense', 'Entertainment', `Monthly entertainment expenses for ${year}-${month.toString().padStart(2, '0')}`, formattedDate]
      );
      
      // Utilities expenses (2000–3500 + monthly increase)
      const utilitiesAmount = 2750 + Math.floor(Math.random() * 750) + monthlyIncrease;
      await connection.execute(
        'INSERT INTO transactions (user_id, amount, type, category, description, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, utilitiesAmount, 'expense', 'Utilities', `Monthly utilities expenses for ${year}-${month.toString().padStart(2, '0')}`, formattedDate]
      );
      
      // Increase income for next month
      monthlyIncome += 1000;
      
      console.log(`Month ${year}-${month.toString().padStart(2, '0')}: Income=${monthlyIncome-1000}, Food=${foodAmount}, Transport=${transportAmount}, Entertainment=${entertainmentAmount}, Utilities=${utilitiesAmount}`);
    }
    
    console.log('Financial history generated successfully');
    
  } catch (error) {
    console.error('Error generating financial history:', error);
  } finally {
    if (connection) {
      connection.release();
      console.log('Database connection closed');
    }
  }
};

// Generate history for user ID 1
generateHistory(1);