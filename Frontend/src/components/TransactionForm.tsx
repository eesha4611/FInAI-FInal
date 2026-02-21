import React, { useState } from 'react';
import transactionService from '../services/transaction.service';
import useRefreshData from '../hooks/useRefreshData';

interface TransactionFormData {
  amount: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
}

interface TransactionFormProps {
  onTransactionAdded?: () => void;
  onClose?: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onTransactionAdded, onClose }) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    amount: '',
    type: 'expense',
    category: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { refreshAllData } = useRefreshData();

  const categories = {
    income: ['Salary', 'Freelance', 'Investment', 'Business', 'Other'],
    expense: ['Food & Dining', 'Shopping', 'Transport', 'Entertainment', 'Bills', 'Healthcare', 'Education', 'Other']
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        setError('Please enter a valid amount');
        return;
      }

      if (!formData.category) {
        setError('Please select a category');
        return;
      }

      const transactionData = {
        amount: Number(amount),
        type: formData.type,
        category: formData.category,
        description: formData.description || undefined,
      };

      console.log("Submitting transaction:", transactionData);

      const result = await transactionService.addTransaction(transactionData);
      
      if (result.success) {
        // Reset form
        setFormData({
          amount: '',
          type: 'expense',
          category: '',
          description: '',
        });

        // Close modal if onClose prop exists
        if (onClose) {
          onClose();
        }

        // Refresh all data automatically
        refreshAllData();

        // Call legacy callback if provided
        if (onTransactionAdded) {
          onTransactionAdded();
        }

        alert('Transaction added successfully!');
      } else {
        setError(result.message || 'Failed to add transaction');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Add Transaction</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
              Amount *
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
              Type *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Select a category</option>
            {categories[formData.type].map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            rows={3}
            placeholder="Optional description..."
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Adding Transaction...' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;

