import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CameraIcon,
  PhotoIcon,
  DocumentTextIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  TrashIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import ocrService from '../services/ocrService';

const ReceiptScanner: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [extractedAmount, setExtractedAmount] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadedFileRef = useRef<File | null>(null);
  const navigate = useNavigate();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadedFileRef.current = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        startScanning(file);
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
      uploadedFileRef.current = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        startScanning(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const startScanning = async (file: File) => {
    setScanning(true);
    setScanComplete(false);
    setExtractedAmount(null);
    
    try {
      const response = await ocrService.scanReceipt(file);
      console.log("Scan API response:", response);
      if (response.success) {
        setExtractedAmount(response.amount);
        setScanComplete(true);
        fetchHistory();
      }
    } catch (error) {
      console.error('Scanning error:', error);
    } finally {
      setScanning(false);
    }
  };

  const resetScanner = () => {
    setUploadedImage(null);
    setScanning(false);
    setScanComplete(false);
    setExtractedAmount(null);
    uploadedFileRef.current = null;
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/ocr/history");
      const data = await response.json();

      if (data.success) {
        setHistory(data.data);
      }
    } catch (error) {
      console.error("History fetch error:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

                {/* Simple Amount Display */}
                {extractedAmount !== null && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="text-sm font-medium text-gray-700">
                      Detected Total
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                      ₹{extractedAmount}
                    </p>
                  </div>
                )}

                {/* Start Scan Button */}
                {uploadedImage && !scanning && !scanComplete && (
                  <div className="text-center">
                    <button
                      onClick={() => uploadedFileRef.current && startScanning(uploadedFileRef.current)}
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

        {/* Sidebar - Recent Scans */}
        <div className="space-y-6">
          {/* Recent Scans */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">Recent Scans</h3>
              <button onClick={() => navigate("/receipt-history")} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-3">
              {history.length === 0 ? (
                <p className="text-gray-500 text-sm">No receipts scanned yet</p>
              ) : (
                history.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm text-gray-600">
                      {new Date(item.scannedAt).toLocaleDateString()}
                    </span>
                    <span className="font-semibold text-gray-800">
                      ₹{item.amount}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptScanner;