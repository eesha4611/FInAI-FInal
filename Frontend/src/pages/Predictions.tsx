import React, { useState } from 'react';
import { 
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  LightBulbIcon,
  ExclamationCircleIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';

const Predictions: React.FC = () => {
  const [predictionRange, setPredictionRange] = useState('3months');

  // Past and predicted data
  const predictionData = [
    { month: 'Nov', actual: 16500, predicted: null, confidence: null },
    { month: 'Dec', actual: 18900, predicted: null, confidence: null },
    { month: 'Jan', actual: 14500, predicted: null, confidence: null },
    { month: 'Feb', actual: 16250, predicted: 16250, confidence: 95 },
    { month: 'Mar', actual: null, predicted: 18500, confidence: 88 },
    { month: 'Apr', actual: null, predicted: 17200, confidence: 85 },
    { month: 'May', actual: null, predicted: 19500, confidence: 82 },
  ];

  // Category predictions
  const categoryPredictions = [
    { 
      category: 'Food & Dining', 
      current: 3250, 
      predicted: 3800, 
      change: '+16.9%', 
      risk: 'high',
      suggestion: 'Consider meal prepping to reduce costs'
    },
    { 
      category: 'Shopping', 
      current: 2500, 
      predicted: 2700, 
      change: '+8%', 
      risk: 'medium',
      suggestion: 'Limit online shopping to essential items'
    },
    { 
      category: 'Transport', 
      current: 1050, 
      predicted: 950, 
      change: '-9.5%', 
      risk: 'low',
      suggestion: 'Good job! Your transport costs are decreasing'
    },
    { 
      category: 'Entertainment', 
      current: 1200, 
      predicted: 1500, 
      change: '+25%', 
      risk: 'high',
      suggestion: 'Set a monthly limit for entertainment'
    },
    { 
      category: 'Bills & Rent', 
      current: 8000, 
      predicted: 8000, 
      change: '0%', 
      risk: 'low',
      suggestion: 'Fixed expense, well managed'
    },
  ];

  // Monthly predictions with confidence intervals
  const detailedPredictions = [
    { 
      month: 'March 2024', 
      predicted: 18500, 
      confidence: 88,
      factors: [
        { factor: 'Festival season', impact: 'high', effect: 'increase' },
        { factor: 'Exam period', impact: 'medium', effect: 'decrease' },
        { factor: 'Salary increase', impact: 'low', effect: 'neutral' }
      ]
    },
    { 
      month: 'April 2024', 
      predicted: 17200, 
      confidence: 85,
      factors: [
        { factor: 'Summer vacation', impact: 'high', effect: 'increase' },
        { factor: 'Online sales', impact: 'medium', effect: 'increase' }
      ]
    },
    { 
      month: 'May 2024', 
      predicted: 19500, 
      confidence: 82,
      factors: [
        { factor: 'Travel plans', impact: 'high', effect: 'increase' },
        { factor: 'Course materials', impact: 'medium', effect: 'increase' }
      ]
    },
  ];

  // Accuracy metrics
  const accuracyMetrics = [
    { metric: 'Prediction Accuracy', value: '87.5%', description: 'Based on last 6 months' },
    { metric: 'Confidence Score', value: '85.2%', description: 'Average confidence level' },
    { metric: 'Margin of Error', value: '± ₹850', description: 'Average prediction error' },
    { metric: 'Model Version', value: 'AI v2.1', description: 'Updated Jan 2024' },
  ];

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">AI Predictions</h1>
          <p className="text-gray-600">Future expense forecasts powered by machine learning</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-gray-400" />
            <select 
              className="input-field py-2"
              value={predictionRange}
              onChange={(e) => setPredictionRange(e.target.value)}
            >
              <option value="1month">Next Month</option>
              <option value="3months">Next 3 Months</option>
              <option value="6months">Next 6 Months</option>
              <option value="1year">Next Year</option>
            </select>
          </div>
          
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center">
            <LightBulbIcon className="h-5 w-5 mr-2" />
            Run New Prediction
          </button>
        </div>
      </div>

      {/* Prediction Overview */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Expense Forecast</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Actual</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Predicted</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Confidence Range</span>
            </div>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={predictionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="month" 
                stroke="#6B7280"
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6B7280"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value/1000}k`}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'actual' || name === 'predicted') {
                    return [`₹${value}`, name === 'actual' ? 'Actual' : 'Predicted'];
                  }
                  return [value, name];
                }}
                labelStyle={{ color: '#374151' }}
              />
              <ReferenceLine x="Feb" stroke="#9CA3AF" strokeDasharray="3 3" />
              
              {/* Confidence area */}
              <Area
                type="monotone"
                dataKey="predicted"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.1}
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              
              {/* Actual data line */}
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Current Month</p>
                <p className="text-2xl font-bold mt-2">₹16,250</p>
              </div>
              <div className="p-2 bg-white rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Within predicted range (₹15,800 - ₹16,700)</p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Next Month Prediction</p>
                <p className="text-2xl font-bold mt-2">₹18,500</p>
              </div>
              <div className="p-2 bg-white rounded-lg">
                <LightBulbIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">88% confidence, ± ₹1,200 range</p>
          </div>
          
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Risk Level</p>
                <p className="text-2xl font-bold mt-2">Medium</p>
              </div>
              <div className="p-2 bg-white rounded-lg">
                <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">2 categories showing high risk</p>
          </div>
        </div>
      </div>

      {/* Category-wise Predictions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Category-wise Predictions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Category</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Current</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Predicted</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Change</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Risk Level</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">AI Suggestion</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {categoryPredictions.map((cat) => (
                <tr key={cat.category} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-800">{cat.category}</div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-800">
                    {formatCurrency(cat.current)}
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-800">
                    {formatCurrency(cat.predicted)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      {cat.change.startsWith('+') ? (
                        <ArrowTrendingUpIcon className="h-4 w-4 text-red-500 mr-1" />
                      ) : cat.change.startsWith('-') ? (
                        <ArrowTrendingDownIcon className="h-4 w-4 text-green-500 mr-1" />
                      ) : null}
                      <span className={`font-medium ${
                        cat.change.startsWith('+') ? 'text-red-600' : 
                        cat.change.startsWith('-') ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {cat.change}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getRiskColor(cat.risk)}`}>
                      {cat.risk.charAt(0).toUpperCase() + cat.risk.slice(1)} Risk
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {cat.suggestion}
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      Set Alert
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Monthly Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Forecast Details */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Monthly Forecast Details</h2>
          <div className="space-y-4">
            {detailedPredictions.map((pred) => (
              <div key={pred.month} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{pred.month}</h3>
                    <div className="flex items-center mt-2">
                      <div className="text-2xl font-bold text-gray-800">
                        {formatCurrency(pred.predicted)}
                      </div>
                      <div className="ml-4 flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${pred.confidence}%` }}
                          />
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-600">
                          {pred.confidence}% confidence
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Key Factors:</p>
                  <div className="flex flex-wrap gap-2">
                    {pred.factors.map((factor, idx) => (
                      <span 
                        key={idx}
                        className={`px-3 py-1 text-xs rounded-full ${
                          factor.impact === 'high' 
                            ? 'bg-red-100 text-red-800' 
                            : factor.impact === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {factor.factor} ({factor.effect})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Accuracy & Insights */}
        <div className="space-y-8">
          {/* Accuracy Metrics */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Prediction Accuracy</h2>
            <div className="grid grid-cols-2 gap-4">
              {accuracyMetrics.map((metric) => (
                <div key={metric.metric} className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">{metric.metric}</p>
                  <p className="text-2xl font-bold mt-2">{metric.value}</p>
                  <p className="text-xs text-gray-600 mt-1">{metric.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <ChartBarIcon className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900">Model Performance</h3>
                  <p className="text-blue-800 text-sm mt-1">
                    Using Linear Regression (87% accuracy) and Seasonal Analysis for predictions.
                    Model trained on 12 months of your transaction history.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
            <div className="flex items-start">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <LightBulbIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">AI Recommendations</h3>
                <div className="mt-4 space-y-3">
                  <div className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Adjust Food Budget:</span> Increase budget to ₹4,000 for March to accommodate predicted spending
                    </p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Set Alert Threshold:</span> Get notified when Entertainment spending exceeds ₹1,300
                    </p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Savings Opportunity:</span> You can save ₹2,500 in March by reducing dining out frequency
                    </p>
                  </div>
                </div>
                <button className="mt-4 text-green-700 hover:text-green-800 text-sm font-medium flex items-center">
                  View Detailed Plan
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prediction Settings */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Prediction Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Enable Auto-Predictions</p>
                <p className="text-sm text-gray-500">Automatically predict expenses weekly</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Alert for High Risk</p>
                <p className="text-sm text-gray-500">Notify when prediction confidence &lt; 75%</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Include Seasonal Factors</p>
                <p className="text-sm text-gray-500">Consider festivals, holidays in predictions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Compare with Peers</p>
                <p className="text-sm text-gray-500">Show how your predictions compare to similar users</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button className="btn-primary">
            Update Prediction Settings
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Settings updated in real-time. Next prediction run: March 1, 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default Predictions;