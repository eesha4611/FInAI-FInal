import React from 'react';
import MessageDisplay from '../components/MessageDisplay';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  ExclamationTriangleIcon, 
  CurrencyDollarIcon,
  ShoppingBagIcon,
  HomeIcon,
  TruckIcon,
  FilmIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  // Stats Data
  const stats = [
    {
      title: 'Total Spent',
      value: '₹16,250',
      change: '+12%',
      trend: 'up',
      icon: CurrencyDollarIcon,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Budget Left',
      value: '₹8,750',
      change: '-8%',
      trend: 'down',
      icon: CurrencyDollarIcon,
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'Predicted Expense',
      value: '₹18,500',
      change: 'AI Prediction',
      trend: 'neutral',
      icon: ArrowUpIcon,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Anomalies Detected',
      value: '3',
      change: 'This month',
      trend: 'warning',
      icon: ExclamationTriangleIcon,
      color: 'bg-red-50 text-red-600',
    },
  ];

  // Recent Expenses
  const recentExpenses = [
    { id: 1, category: 'Food & Dining', amount: '₹850', date: 'Today', anomaly: false, icon: ShoppingBagIcon, iconColor: 'text-blue-500' },
    { id: 2, category: 'Shopping', amount: '₹2,500', date: 'Yesterday', anomaly: true, icon: ShoppingBagIcon, iconColor: 'text-purple-500' },
    { id: 3, category: 'Transport', amount: '₹350', date: 'Feb 8', anomaly: false, icon: TruckIcon, iconColor: 'text-green-500' },
    { id: 4, category: 'Entertainment', amount: '₹1,200', date: 'Feb 7', anomaly: false, icon: FilmIcon, iconColor: 'text-yellow-500' },
    { id: 5, category: 'Rent', amount: '₹8,000', date: 'Feb 5', anomaly: false, icon: HomeIcon, iconColor: 'text-red-500' },
  ];

  // Spending Trend Data
  const spendingData = [
    { month: 'Jan', amount: 14500 },
    { month: 'Feb', amount: 16250 },
    { month: 'Mar', amount: 18500 },
  ];

  // Category-wise spending for pie chart
  const categoryData = [
    { name: 'Food & Dining', value: 25, color: '#3B82F6' },
    { name: 'Shopping', value: 20, color: '#8B5CF6' },
    { name: 'Rent', value: 35, color: '#EF4444' },
    { name: 'Transport', value: 10, color: '#10B981' },
    { name: 'Entertainment', value: 10, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-8">
      {/* Message Display */}
      <MessageDisplay />
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your financial overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="card">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.trend === 'up' ? (
                    <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : stat.trend === 'down' ? (
                    <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  ) : null}
                  <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spending Trend Chart */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Spending Trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spendingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  formatter={(value) => [`₹${value}`, 'Amount']}
                  labelStyle={{ color: '#374151' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-500 mt-4">AI Prediction: Next month expected ₹18,500</p>
        </div>

        {/* Category Distribution */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Spending by Category</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            {categoryData.map((category) => (
              <div key={category.name} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm text-gray-600">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Expenses Table */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Recent Expenses</h2>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All →
          </button>
        </div>
        
        <div className="space-y-4">
          {recentExpenses.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${expense.iconColor.replace('text-', 'bg-')} bg-opacity-10 mr-4`}>
                  <expense.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">{expense.category}</h3>
                  <p className="text-sm text-gray-500">{expense.date}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="font-semibold text-gray-800">{expense.amount}</span>
                {expense.anomaly && (
                  <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                    Anomaly
                  </span>
                )}
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="card bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
        <div className="flex items-start">
          <div className="p-3 bg-blue-100 rounded-lg mr-4">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">AI Insight</h3>
            <p className="text-gray-600 mt-1">
              Your dining expenses are 25% higher than last month. Consider setting a monthly limit of ₹5,000 for Food & Dining.
            </p>
            <button className="mt-3 text-primary-600 hover:text-primary-700 text-sm font-medium">
              Set Budget Limit →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;