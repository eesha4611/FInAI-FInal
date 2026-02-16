import React, { useState, useEffect } from 'react';
import TransactionForm from '../components/TransactionForm';
import transactionService from '../services/transaction.service';
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  ReceiptPercentIcon,
  ShoppingBagIcon,
  HomeIcon,
  TruckIcon,
  FilmIcon,
  EllipsisHorizontalIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Transaction {
  id: number;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description?: string;
  createdAt: string;
}

const Expenses: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch transactions data
  const fetchExpensesData = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await transactionService.getTransactions();
      if (response.success && response.data?.transactions) {
        setTransactions(response.data.transactions);
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Expenses error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpensesData();
  }, []);

  const filters = [
    { id: 'all', label: 'All Expenses' },
    { id: 'anomaly', label: 'Anomalies' },
    { id: 'food', label: 'Food & Dining' },
    { id: 'shopping', label: 'Shopping' },
    { id: 'transport', label: 'Transport' },
  ];

  const categories = [
    { id: 1, name: 'Food & Dining', icon: ShoppingBagIcon, color: 'bg-blue-100 text-blue-600', budget: 5000, spent: 3250 },
    { id: 2, name: 'Shopping', icon: ReceiptPercentIcon, color: 'bg-purple-100 text-purple-600', budget: 3000, spent: 2500 },
    { id: 3, name: 'Transport', icon: TruckIcon, color: 'bg-green-100 text-green-600', budget: 2000, spent: 1050 },
    { id: 4, name: 'Entertainment', icon: FilmIcon, color: 'bg-yellow-100 text-yellow-600', budget: 1500, spent: 1200 },
    { id: 5, name: 'Rent', icon: HomeIcon, color: 'bg-red-100 text-red-600', budget: 8000, spent: 8000 },
  ];

  const expenses = [
    { id: 1, name: 'Dinner at Restaurant', category: 'Food & Dining', amount: 850, date: 'Today', anomaly: false, receipt: true },
    { id: 2, name: 'Online Shopping', category: 'Shopping', amount: 2500, date: 'Yesterday', anomaly: true, receipt: false },
    { id: 3, name: 'Uber Ride', category: 'Transport', amount: 350, date: 'Feb 8', anomaly: false, receipt: true },
    { id: 4, name: 'Movie Tickets', category: 'Entertainment', amount: 1200, date: 'Feb 7', anomaly: false, receipt: true },
    { id: 5, name: 'Monthly Rent', category: 'Rent', amount: 8000, date: 'Feb 5', anomaly: false, receipt: true },
    { id: 6, name: 'Grocery Shopping', category: 'Food & Dining', amount: 1800, date: 'Feb 4', anomaly: false, receipt: true },
    { id: 7, name: 'Fuel', category: 'Transport', amount: 700, date: 'Feb 3', anomaly: false, receipt: true },
    { id: 8, name: 'Clothing', category: 'Shopping', amount: 3200, date: 'Feb 2', anomaly: true, receipt: false },
  ];

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Expenses</h1>
          <p className="text-gray-600">Track and manage all your expenses</p>
        </div>
        <button 
          onClick={() => setShowAddExpenseModal(true)}
          className="btn-primary flex items-center mt-4 md:mt-0"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Expense
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total This Month</p>
              <p className="text-2xl font-bold mt-2">₹16,250</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Budget Used</p>
              <p className="text-2xl font-bold mt-2">65%</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <ReceiptPercentIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Anomalies Found</p>
              <p className="text-2xl font-bold mt-2">3</p>
            </div>
            <div className="p-3 bg-red-50 rounded-full">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              className="input-field pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
              <select className="input-field py-2">
                <option>This Month</option>
                <option>Last Month</option>
                <option>Last 3 Months</option>
                <option>Custom Range</option>
              </select>
            </div>
            
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FunnelIcon className="h-5 w-5 mr-2 text-gray-600" />
              Filter
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mt-6 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeFilter === filter.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Overview */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Categories Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((category) => {
            const percentage = (category.spent / category.budget) * 100;
            return (
              <div key={category.id} className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${category.color}`}>
                    <category.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Spent</span>
                    <span className="font-semibold">{formatCurrency(category.spent)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Budget</span>
                    <span className="text-gray-700">{formatCurrency(category.budget)}</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        percentage > 90 ? 'bg-red-500' :
                        percentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-right">
                    {percentage.toFixed(0)}% used
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expenses Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Description</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Category</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Receipt</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions
                .filter(transaction => transaction.type === 'expense')
                .map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-800">{transaction.description || 'No description'}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-800">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-gray-400 text-sm">No receipt</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Normal
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-gray-400 hover:text-gray-600">
                      <EllipsisHorizontalIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {expenses.length} of 42 expenses
          </p>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add missing imports */}
      <div className="hidden">
        {/* These icons are used in the component */}
        <CurrencyDollarIcon />
        <ExclamationTriangleIcon />
      </div>

      {/* Add Expense Modal */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Add Expense</h2>
              <button
                onClick={() => setShowAddExpenseModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <TransactionForm 
              onTransactionAdded={() => {
                setShowAddExpenseModal(false);
                fetchExpensesData(); // Refresh expenses list
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;

// Add missing icon imports
const CurrencyDollarIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ExclamationTriangleIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);