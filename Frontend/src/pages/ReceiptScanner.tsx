import React, { useState, useRef } from 'react';
import { 
  CameraIcon,
  PhotoIcon,
  DocumentTextIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  TrashIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const ReceiptScanner: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanResults, setScanResults] = useState<any>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock scan results
  const mockResults = {
    merchant: 'Restaurant XYZ',
    date: '2024-02-10',
    time: '19:45',
    total: 850.00,
    items: [
      { name: 'Pizza', quantity: 1, price: 450.00 },
      { name: 'Pasta', quantity: 1, price: 320.00 },
      { name: 'Soft Drink', quantity: 1, price: 80.00 },
    ],
    tax: 76.50,
    tip: 0,
    category: 'Food & Dining',
    confidence: 94.2
  };

  // Recent scans
  const recentScans = [
    { id: 1, merchant: 'Supermarket', amount: 1800, date: 'Today', status: 'processed' },
    { id: 2, merchant: 'Fuel Station', amount: 700, date: 'Yesterday', status: 'processed' },
    { id: 3, merchant: 'Book Store', amount: 1200, date: 'Feb 8', status: 'failed' },
    { id: 4, merchant: 'Coffee Shop', amount: 250, date: 'Feb 7', status: 'processed' },
    { id: 5, merchant: 'Pharmacy', amount: 450, date: 'Feb 6', status: 'pending' },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        startScanning();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        startScanning();
      };
      reader.readAsDataURL(file);
    }
  };

  const startScanning = () => {
    setScanning(true);
    setScanComplete(false);
    
    // Simulate scanning process
    setTimeout(() => {
      setScanning(false);
      setScanComplete(true);
      setScanResults(mockResults);
    }, 2000);
  };

  const resetScanner = () => {
    setUploadedImage(null);
    setScanning(false);
    setScanComplete(false);
    setScanResults(null);
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Receipt Scanner</h1>
          <p className="text-gray-600">Upload or capture receipts for automatic expense tracking</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
            <MagnifyingGlassIcon className="h-5 w-5 mr-2 text-gray-600" />
            Scan History
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center">
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Batch Upload
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload & Scan Section */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Scan Receipt</h2>
            
            {/* Upload Area */}
            {!uploadedImage ? (
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragOver 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="max-w-md mx-auto">
                  <div className="p-4 bg-primary-50 rounded-full inline-flex">
                    <CloudArrowUpIcon className="h-12 w-12 text-primary-600" />
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-800">Upload Receipt</h3>
                    <p className="text-gray-600 mt-2">
                      Drag & drop an image, or click to browse
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Supports JPG, PNG, PDF (Max 10MB)
                    </p>
                  </div>
                  
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCameraCapture();
                      }}
                      className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 flex flex-col items-center"
                    >
                      <CameraIcon className="h-8 w-8 text-gray-600 mb-2" />
                      <span className="text-sm font-medium">Use Camera</span>
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 flex flex-col items-center"
                    >
                      <PhotoIcon className="h-8 w-8 text-gray-600 mb-2" />
                      <span className="text-sm font-medium">Choose File</span>
                    </button>
                  </div>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*,.pdf"
                    className="hidden"
                  />
                </div>
              </div>
            ) : (
              /* Image Preview & Scan Results */
              <div className="space-y-6">
                {/* Image Preview */}
                <div className="relative">
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={uploadedImage} 
                      alt="Receipt preview" 
                      className="w-full h-64 object-contain bg-gray-50"
                    />
                  </div>
                  
                  <button
                    onClick={resetScanner}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                  >
                    <TrashIcon className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                {/* Scanning Progress */}
                {scanning && (
                  <div className="p-6 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <ArrowPathIcon className="h-8 w-8 text-blue-600 animate-spin mr-4" />
                      <div className="flex-1">
                        <h3 className="font-medium text-blue-900">Scanning Receipt...</h3>
                        <p className="text-blue-800 text-sm mt-1">
                          Using AI to extract transaction details
                        </p>
                        <div className="w-full bg-blue-200 rounded-full h-2 mt-3">
                          <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Scan Results */}
                {scanComplete && scanResults && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">Scan Results</h3>
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-sm font-medium text-green-600">
                          {scanResults.confidence}% confidence
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic Info */}
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">Merchant</p>
                          <p className="font-semibold text-gray-800">{scanResults.merchant}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-medium text-gray-700">{scanResults.date}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Time</p>
                            <p className="font-medium text-gray-700">{scanResults.time}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Category</p>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {scanResults.category}
                          </span>
                        </div>
                      </div>

                      {/* Total Amount */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="text-3xl font-bold text-gray-800 mt-2">
                          {formatCurrency(scanResults.total)}
                        </p>
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">{formatCurrency(scanResults.total - scanResults.tax)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tax (9%)</span>
                            <span className="font-medium">{formatCurrency(scanResults.tax)}</span>
                          </div>
                          <div className="border-t border-gray-200 pt-2 mt-2">
                            <div className="flex justify-between font-semibold">
                              <span>Total</span>
                              <span>{formatCurrency(scanResults.total)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Items List */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Items</h4>
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Item</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Quantity</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Price</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {scanResults.items.map((item: any, index: number) => (
                              <tr key={index} className="border-t border-gray-100">
                                <td className="py-3 px-4 text-gray-800">{item.name}</td>
                                <td className="py-3 px-4 text-gray-600">{item.quantity}</td>
                                <td className="py-3 px-4 text-gray-600">{formatCurrency(item.price)}</td>
                                <td className="py-3 px-4 font-medium">
                                  {formatCurrency(item.price * item.quantity)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <button className="btn-primary flex-1">
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        Save Expense
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex-1">
                        <ArrowPathIcon className="h-5 w-5 mr-2 text-gray-600" />
                        Rescan
                      </button>
                      <button 
                        onClick={resetScanner}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex-1"
                      >
                        <XCircleIcon className="h-5 w-5 mr-2 text-gray-600" />
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Start Scan Button */}
                {uploadedImage && !scanning && !scanComplete && (
                  <div className="text-center">
                    <button
                      onClick={startScanning}
                      className="btn-primary px-8 py-3 text-lg"
                    >
                      <DocumentTextIcon className="h-6 w-6 inline mr-2" />
                      Start AI Scan
                    </button>
                    <p className="text-sm text-gray-500 mt-3">
                      Click to analyze receipt using OCR and AI
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tips & Guidelines */}
          <div className="card mt-6">
            <h3 className="font-semibold text-gray-800 mb-4">Tips for Best Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-700">Good Lighting</p>
                  <p className="text-sm text-gray-600">Ensure receipt is well-lit for better OCR accuracy</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-700">Flat Surface</p>
                  <p className="text-sm text-gray-600">Place receipt on a flat surface before capturing</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-700">Clear Text</p>
                  <p className="text-sm text-gray-600">Make sure all text is visible and not cut off</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-700">Avoid Glare</p>
                  <p className="text-sm text-gray-600">Position camera to avoid reflections on receipt</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Stats & Recent Scans */}
        <div className="space-y-6">
          {/* OCR Stats */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4">OCR Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Text Recognition</span>
                  <span className="font-medium">96.4%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '96.4%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Amount Detection</span>
                  <span className="font-medium">98.2%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '98.2%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Date Parsing</span>
                  <span className="font-medium">94.7%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '94.7%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <p className="text-sm text-blue-800">
                  Using Tesseract OCR with custom-trained ML models for finance receipts
                </p>
              </div>
            </div>
          </div>

          {/* Recent Scans */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">Recent Scans</h3>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-3">
              {recentScans.map((scan) => (
                <div key={scan.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg mr-3 ${
                      scan.status === 'processed' ? 'bg-green-100' :
                      scan.status === 'failed' ? 'bg-red-100' : 'bg-yellow-100'
                    }`}>
                      {scan.status === 'processed' ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      ) : scan.status === 'failed' ? (
                        <XCircleIcon className="h-5 w-5 text-red-600" />
                      ) : (
                        <ArrowPathIcon className="h-5 w-5 text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{scan.merchant}</p>
                      <p className="text-sm text-gray-500">{scan.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{formatCurrency(scan.amount)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      scan.status === 'processed' ? 'bg-green-100 text-green-800' :
                      scan.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {scan.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
            <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-left flex items-center">
                <svg className="h-5 w-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-800">Scan Multiple Receipts</p>
                  <p className="text-sm text-gray-600">Upload up to 10 receipts at once</p>
                </div>
              </button>
              
              <button className="w-full p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-left flex items-center">
                <svg className="h-5 w-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <div>
                  <p className="font-medium text-gray-800">Export Data</p>
                  <p className="text-sm text-gray-600">Export scanned data to CSV or Excel</p>
                </div>
              </button>
              
              <button className="w-full p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-left flex items-center">
                <svg className="h-5 w-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-800">Privacy Settings</p>
                  <p className="text-sm text-gray-600">Manage receipt data storage</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptScanner;