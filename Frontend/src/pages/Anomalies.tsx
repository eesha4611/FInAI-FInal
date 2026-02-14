import React, { useState } from 'react';
import { 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  EyeIcon,
  FlagIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell 
} from 'recharts';

const Anomalies: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [selectedAnomaly, setSelectedAnomaly] = useState<number | null>(null);

  // Anomalies data
  const anomalies = [
    { 
      id: 1,
      title: 'Unusual Shopping Transaction',
      category: 'Shopping',
      amount: 2500,
      date: 'Yesterday, 4:30 PM',
      location: 'Online Store',
      severity: 'high',
      confidence: 92,
      reason: 'Amount 3x higher than your average shopping transaction',
      status: 'pending',
      suggestedAction: 'Review and confirm if this was you'
    },
    { 
      id: 2,
      title: 'Late Night Food Order',
      category: 'Food & Dining',
      amount: 850,
      date: 'Today, 1:45 AM',
      location: 'Restaurant XYZ',
      severity: 'medium',
      confidence: 78,
      reason: 'Transaction time outside your usual pattern (usually 6-10 PM)',
      status: 'pending',
      suggestedAction: 'Set time restrictions for food orders'
    },
    { 
      id: 3,
      title: 'Duplicate Transaction',
      category: 'Entertainment',
      amount: 1200,
      date: 'Feb 7, 7:20 PM',
      location: 'Movie Theater',
      severity: 'low',
      confidence: 65,
      reason: 'Similar amount charged twice within 5 minutes',
      status: 'resolved',
      resolvedAs: 'legitimate'
    },
    { 
      id: 4,
      title: 'Geographic Anomaly',
      category: 'Transport',
      amount: 350,
      date: 'Feb 8, 10:15 AM',
      location: 'City Center',
      severity: 'medium',
      confidence: 81,
      reason: 'Transaction location 50km away from your usual area',
      status: 'resolved',
      resolvedAs: 'fraud'
    },
    { 
      id: 5,
      title: 'Unusual Frequency',
      category: 'Food & Dining',
      amount: 650,
      date: 'Feb 6, 8:30 PM',
      location: 'Cafe ABC',
      severity: 'low',
      confidence: 72,
      reason: '4th transaction at same location this week',
      status: 'pending',
      suggestedAction: 'Monitor this vendor'
    },
  ];

  // Anomaly statistics
  const anomalyStats = [
    { period: 'Today', count: 2, change: '+100%' },
    { period: 'This Week', count: 5, change: '+25%' },
    { period: 'This Month', count: 12, change: '-15%' },
    { period: 'Resolved', count: 8, change: '+33%' },
  ];

  // Severity distribution
  const severityData = [
    { severity: 'High', count: 4, color: '#EF4444' },
    { severity: 'Medium', count: 5, color: '#F59E0B' },
    { severity: 'Low', count: 3, color: '#3B82F6' },
  ];

  // Category distribution
  const categoryData = [
    { category: 'Food & Dining', count: 5, color: '#3B82F6' },
    { category: 'Shopping', count: 3, color: '#8B5CF6' },
    { category: 'Entertainment', count: 2, color: '#10B981' },
    { category: 'Transport', count: 2, color: '#F59E0B' },
  ];

  const filters = [
    { id: 'all', label: 'All Anomalies' },
    { id: 'high', label: 'High Severity' },
    { id: 'pending', label: 'Pending Review' },
    { id: 'resolved', label: 'Resolved' },
    { id: 'thisWeek', label: 'This Week' },
  ];

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const filteredAnomalies = anomalies.filter(anomaly => {
    if (filter === 'all') return true;
    if (filter === 'high') return anomaly.severity === 'high';
    if (filter === 'pending') return anomaly.status === 'pending';
    if (filter === 'resolved') return anomaly.status === 'resolved';
    if (filter === 'thisWeek') return true; // Simplified for demo
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Anomaly Detection</h1>
          <p className="text-gray-600">AI-powered detection of unusual spending patterns</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
            <ArrowPathIcon className="h-5 w-5 mr-2 text-gray-600" />
            Refresh Detection
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center">
            <FlagIcon className="h-5 w-5 mr-2" />
            Report False Positive
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Anomalies</p>
              <p className="text-2xl font-bold mt-2">3</p>
              <div className="flex items-center mt-2">
                <ExclamationTriangleIcon className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-sm text-red-600">Requires attention</span>
              </div>
            </div>
            <div className="p-3 bg-red-50 rounded-full">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Detection Accuracy</p>
              <p className="text-2xl font-bold mt-2">94.2%</p>
              <div className="flex items-center mt-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">High confidence</span>
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg. Response Time</p>
              <p className="text-2xl font-bold mt-2">4.2h</p>
              <div className="flex items-center mt-2">
                <ArrowPathIcon className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm text-blue-600">Faster than average</span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <ArrowPathIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Money Protected</p>
              <p className="text-2xl font-bold mt-2">₹8,500</p>
              <div className="flex items-center mt-2">
                <XCircleIcon className="h-4 w-4 text-purple-500 mr-1" />
                <span className="text-sm text-purple-600">This month</span>
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <XCircleIcon className="h-6 w-6 text-purple-600" />
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
              placeholder="Search anomalies..."
              className="input-field pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select className="input-field py-2">
                <option>All Categories</option>
                <option>Food & Dining</option>
                <option>Shopping</option>
                <option>Entertainment</option>
                <option>Transport</option>
              </select>
            </div>
            
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <svg className="h-5 w-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Advanced Filter
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mt-6 overflow-x-auto pb-2">
          {filters.map((filterItem) => (
            <button
              key={filterItem.id}
              onClick={() => setFilter(filterItem.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                filter === filterItem.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filterItem.label}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Severity Distribution */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Anomaly Severity Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="severity" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Bar dataKey="count">
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between mt-4">
            {severityData.map((item) => (
              <div key={item.severity} className="text-center">
                <div className="flex items-center justify-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">{item.severity}</span>
                </div>
                <p className="text-2xl font-bold mt-2">{item.count}</p>
                <p className="text-xs text-gray-500">anomalies</p>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Anomalies by Category</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="category" stroke="#6B7280" angle={-45} textAnchor="end" height={60} />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Bar dataKey="count">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Food & Dining has the highest number of anomalies (5 detected)
          </p>
        </div>
      </div>

      {/* Anomalies List */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Detected Anomalies</h2>
          <div className="text-sm text-gray-500">
            Showing {filteredAnomalies.length} of {anomalies.length} anomalies
          </div>
        </div>
        
        <div className="space-y-4">
          {filteredAnomalies.map((anomaly) => (
            <div 
              key={anomaly.id} 
              className={`p-4 border rounded-lg transition-all hover:shadow-md ${
                selectedAnomaly === anomaly.id 
                  ? 'border-primary-300 bg-primary-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedAnomaly(anomaly.id === selectedAnomaly ? null : anomaly.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`p-2 rounded-lg ${getSeverityColor(anomaly.severity)}`}>
                    <ExclamationTriangleIcon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800">{anomaly.title}</h3>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(anomaly.severity)}`}>
                          {anomaly.severity.charAt(0).toUpperCase() + anomaly.severity.slice(1)} Risk
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(anomaly.status)}`}>
                          {anomaly.status.charAt(0).toUpperCase() + anomaly.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                      <div>
                        <p className="text-xs text-gray-500">Amount</p>
                        <p className="font-semibold text-gray-800">{formatCurrency(anomaly.amount)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Category</p>
                        <p className="font-medium text-gray-700">{anomaly.category}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Date & Time</p>
                        <p className="font-medium text-gray-700">{anomaly.date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">AI Confidence</p>
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${anomaly.confidence}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{anomaly.confidence}%</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Expanded Details */}
                    {selectedAnomaly === anomaly.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Detection Details</h4>
                            <div className="space-y-2">
                              <div className="flex">
                                <InformationCircleIcon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                                <p className="text-sm text-gray-600">{anomaly.reason}</p>
                              </div>
                              <div className="flex">
                                <InformationCircleIcon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                                <p className="text-sm text-gray-600">Location: {anomaly.location}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Actions</h4>
                            {anomaly.status === 'pending' ? (
                              <div className="space-y-3">
                                <p className="text-sm text-gray-600">{anomaly.suggestedAction}</p>
                                <div className="flex space-x-3">
                                  <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm font-medium">
                                    <CheckCircleIcon className="h-4 w-4 inline mr-1" />
                                    Mark as Legitimate
                                  </button>
                                  <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium">
                                    <XCircleIcon className="h-4 w-4 inline mr-1" />
                                    Report as Fraud
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                  Resolved as: <span className="font-medium">{anomaly.resolvedAs}</span>
                                </p>
                                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                  View Resolution Details
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <button className="ml-4 text-gray-400 hover:text-gray-600">
                  <EyeIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty State */}
        {filteredAnomalies.length === 0 && (
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No anomalies found</h3>
            <p className="mt-2 text-gray-600">No anomalies match your current filters.</p>
            <button 
              onClick={() => setFilter('all')}
              className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* AI Insights & Protection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Insights */}
        <div className="card bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
          <div className="flex items-start">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">AI Insights</h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Pattern Detected:</span> 80% of your anomalies occur between 8 PM - 2 AM
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Improvement:</span> Your anomaly rate decreased by 15% this month
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Alert:</span> Food & Dining category has highest false positive rate (18%)
                  </p>
                </div>
              </div>
              <button className="mt-4 text-blue-700 hover:text-blue-800 text-sm font-medium">
                Adjust Detection Sensitivity →
              </button>
            </div>
          </div>
        </div>

        {/* Protection Settings */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Protection Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Real-time Monitoring</p>
                <p className="text-sm text-gray-500">Monitor transactions 24/7</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Email Alerts</p>
                <p className="text-sm text-gray-500">Get notified for high-risk anomalies</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Auto-block Suspicious</p>
                <p className="text-sm text-gray-500">Block transactions with &gt;90% fraud probability</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Location-based Protection</p>
                <p className="text-sm text-gray-500">Alert for transactions outside usual locations</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button className="btn-primary">
              Update Protection Settings
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Changes take effect immediately. Last updated: Today, 10:30 AM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Anomalies;