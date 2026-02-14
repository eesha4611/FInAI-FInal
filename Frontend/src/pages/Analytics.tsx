import React, { useState } from 'react';
import { 
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  HomeIcon,
  TruckIcon,
  FilmIcon
} from '@heroicons/react/24/outline';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('monthly');

  // Monthly spending data
  const monthlyData = [
    { month: 'Aug', income: 25000, expense: 14200, savings: 10800 },
    { month: 'Sep', income: 25000, expense: 15800, savings: 9200 },
    { month: 'Oct', income: 25000, expense: 17200, savings: 7800 },
    { month: 'Nov', income: 25000, expense: 16500, savings: 8500 },
    { month: 'Dec', income: 25000, expense: 18900, savings: 6100 },
    { month: 'Jan', income: 25000, expense: 14500, savings: 10500 },
    { month: 'Feb', income: 25000, expense: 16250, savings: 8750 },
  ];

  // Weekly spending
  const weeklyData = [
    { day: 'Mon', amount: 2200 },
    { day: 'Tue', amount: 1800 },
    { day: 'Wed', amount: 3100 },
    { day: 'Thu', amount: 2700 },
    { day: 'Fri', amount: 4200 },
    { day: 'Sat', amount: 3800 },
    { day: 'Sun', amount: 1500 },
  ];

  // Category breakdown
  const categoryData = [
    { name: 'Food & Dining', value: 25, color: '#3B82F6', icon: ShoppingBagIcon, trend: '+12%' },
    { name: 'Shopping', value: 20, color: '#8B5CF6', icon: ShoppingBagIcon, trend: '+25%' },
    { name: 'Rent', value: 35, color: '#EF4444', icon: HomeIcon, trend: '0%' },
    { name: 'Transport', value: 10, color: '#10B981', icon: TruckIcon, trend: '-5%' },
    { name: 'Entertainment', value: 10, color: '#F59E0B', icon: FilmIcon, trend: '+8%' },
  ];

  // Spending habits
  const habits = [
    { title: 'Most Expensive Day', value: 'Friday', description: 'Average spending: ₹4,200', trend: '+15%' },
    { title: 'Top Category', value: 'Food & Dining', description: '25% of total expenses', trend: '+12%' },
    { title: 'Best Saving Day', value: 'Sunday', description: 'Average spending: ₹1,500', trend: '-20%' },
    { title: 'Monthly Average', value: '₹16,250', description: 'Compared to ₹15,800 last month', trend: '+3%' },
  ];

  // Comparison data
  const comparisonData = [
    { category: 'Food', you: 3250, average: 2800 },
    { category: 'Shopping', you: 2500, average: 2200 },
    { category: 'Transport', you: 1050, average: 1200 },
    { category: 'Entertainment', you: 1200, average: 1500 },
    { category: 'Bills', you: 8000, average: 7500 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
          <p className="text-gray-600">Deep insights into your spending patterns</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-gray-400" />
            <select 
              className="input-field py-2"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="quarterly">Last 3 Months</option>
              <option value="yearly">This Year</option>
            </select>
          </div>
          
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
            <svg className="h-5 w-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg. Monthly Spend</p>
              <p className="text-2xl font-bold mt-2">₹16,250</p>
              <div className="flex items-center mt-2">
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+3% from last month</span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Savings Rate</p>
              <p className="text-2xl font-bold mt-2">35%</p>
              <div className="flex items-center mt-2">
                <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-sm text-red-600">-2% from last month</span>
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Most Spent On</p>
              <p className="text-2xl font-bold mt-2">Food & Dining</p>
              <div className="flex items-center mt-2">
                <ArrowTrendingUpIcon className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-sm text-red-600">12% above budget</span>
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <ShoppingBagIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Anomaly Frequency</p>
              <p className="text-2xl font-bold mt-2">8.2%</p>
              <div className="flex items-center mt-2">
                <ArrowTrendingDownIcon className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">-15% from last month</span>
              </div>
            </div>
            <div className="p-3 bg-red-50 rounded-full">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Income vs Expenses Chart */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Income vs Expenses</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  formatter={(value) => [`₹${value}`, 'Amount']}
                  labelStyle={{ color: '#374151' }}
                />
                <Legend />
                <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Your expenses increased by 12% this month compared to last month
          </p>
        </div>

        {/* Weekly Spending Pattern */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Weekly Spending Pattern</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  formatter={(value) => [`₹${value}`, 'Amount']}
                  labelStyle={{ color: '#374151' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            You spend most on Fridays (₹4,200 average) and least on Sundays (₹1,500 average)
          </p>
        </div>
      </div>

      {/* Category Breakdown & Habits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Category Breakdown</h2>
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
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-3">
            {categoryData.map((category) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: category.color }} />
                  <span className="text-gray-700">{category.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold mr-3">{category.value}%</span>
                  <span className={`text-sm ${category.trend.startsWith('+') ? 'text-red-600' : category.trend.startsWith('-') ? 'text-green-600' : 'text-gray-600'}`}>
                    {category.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spending Habits */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Spending Habits</h2>
          <div className="space-y-4">
            {habits.map((habit) => (
              <div key={habit.title} className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-700">{habit.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{habit.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-800">{habit.value}</p>
                    <p className={`text-sm mt-1 ${habit.trend.startsWith('+') ? 'text-red-600' : habit.trend.startsWith('-') ? 'text-green-600' : 'text-gray-600'}`}>
                      {habit.trend} from average
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison with Average */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Comparison with Student Average</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="category" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                formatter={(value) => [`₹${value}`, 'Amount']}
                labelStyle={{ color: '#374151' }}
              />
              <Legend />
              <Bar dataKey="you" name="Your Spending" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="average" name="Student Average" fill="#9CA3AF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start">
            <svg className="h-5 w-5 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-medium text-blue-900">Insight</h3>
              <p className="text-blue-800 text-sm mt-1">
                You spend 15% more on food & dining compared to other students. 
                Consider setting a budget limit of ₹4,000 for this category.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
        <div className="flex items-start">
          <div className="p-3 bg-blue-100 rounded-lg mr-4">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">AI Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-white rounded-lg border">
                <h4 className="font-medium text-gray-800">Reduce Food Spending</h4>
                <p className="text-sm text-gray-600 mt-1">Limit dining out to twice a week, save ~₹2,000/month</p>
              </div>
              <div className="p-3 bg-white rounded-lg border">
                <h4 className="font-medium text-gray-800">Optimize Transport</h4>
                <p className="text-sm text-gray-600 mt-1">Use public transport 3 days/week, save ~₹800/month</p>
              </div>
              <div className="p-3 bg-white rounded-lg border">
                <h4 className="font-medium text-gray-800">Weekend Spending</h4>
                <p className="text-sm text-gray-600 mt-1">Friday & Saturday account for 45% of weekly expenses</p>
              </div>
              <div className="p-3 bg-white rounded-lg border">
                <h4 className="font-medium text-gray-800">Savings Goal</h4>
                <p className="text-sm text-gray-600 mt-1">Aim for 40% savings rate next month (currently 35%)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;