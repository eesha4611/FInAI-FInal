import React, { useEffect, useState, useRef } from 'react';
import ExpenseCategoryChart from '../components/ExpenseCategoryChart';
import { useNavigate } from 'react-router-dom';
import TransactionForm from '../components/TransactionForm';
import dashboardService from '../services/dashboard.service';
import transactionService from '../services/transaction.service';

interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
}

interface Transaction {
  id: number;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description?: string;
  createdAt: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const formRef = useRef<HTMLDivElement>(null);

  const [stats, setStats] = useState<DashboardStats>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    transactionCount: 0
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDeleteTransaction = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;

    try {
      const result = await transactionService.deleteTransaction(id);
      if (result.success) {
        alert('Transaction deleted successfully!');
        loadDashboardData();
      } else {
        alert('Failed to delete transaction: ' + (result.message || 'Unknown error'));
      }
    } catch {
      alert('Failed to connect to server');
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const statsResponse = await dashboardService.getDashboardData();
      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }

      const transactionsResponse = await transactionService.getTransactions();
      if (transactionsResponse.success && transactionsResponse.data) {
        setTransactions(transactionsResponse.data.transactions || []);
      }
    } catch (err) {
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const recentExpenses = transactions
    .filter(tx => tx.type === 'expense')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your financial overview.</p>
        </div>

        <button
          onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-sm"
        >
          <span className="text-xl mr-2">+</span>
          Add Expense
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Income" value={stats.totalIncome} color="green" />
        <StatCard title="Total Expenses" value={stats.totalExpense} color="red" />
        <StatCard title="Balance" value={stats.balance} color="blue" />
        <StatCard title="Transactions" value={stats.transactionCount} color="gray" />
      </div>

      {/* Expense Category Chart */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Expenses by Category
        </h2>
        <ExpenseCategoryChart />
      </div>

      {/* Recent Expenses */}
      <div className="bg-white shadow rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Expenses</h2>
          <button
            onClick={() => navigate('/expenses')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All
          </button>
        </div>

        {recentExpenses.length === 0 ? (
          <p className="text-gray-500">No expenses yet</p>
        ) : (
          <div className="space-y-3">
            {recentExpenses.map((expense) => (
              <div key={expense.id} className="flex justify-between items-center py-3 border-b">
                <div>
                  <h3 className="font-medium text-gray-800">{expense.category}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(expense.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center">
                  <span className="font-semibold text-red-500">
                    {Number(expense.amount).toFixed(2)}
                  </span>

                  <button
                    onClick={() => handleDeleteTransaction(expense.id)}
                    className="ml-4 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transaction Form */}
      <div ref={formRef}>
        <TransactionForm onTransactionAdded={loadDashboardData} />
      </div>
    </div>
  );
};

/* Reusable Stat Card */
const StatCard = ({ title, value, color }: any) => (
  <div className="bg-white shadow rounded-xl p-4">
    <p className="text-sm text-gray-500">{title}</p>
    <p className={`text-2xl font-bold mt-2 text-${color}-600`}>
      {Number(value || 0).toFixed(2)}
    </p>
  </div>
);

export default Dashboard;
