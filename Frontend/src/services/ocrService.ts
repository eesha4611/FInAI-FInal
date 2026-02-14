import api from './api';

export interface ScanResult {
  merchant: string;
  date: string;
  time: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  tax: number;
  tip?: number;
  category: string;
  confidence: number;
}

export const ocrService = {
  // POST scan single receipt
  scanReceipt: async (file: File) => {
    const formData = new FormData();
    formData.append('receipt', file);
    
    const response = await api.post('/ocr/scan', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // POST batch scan multiple receipts
  batchScan: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`receipts`, file);
    });
    
    const response = await api.post('/ocr/batch', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // GET scan history
  getHistory: async () => {
    const response = await api.get('/ocr/history');
    return response.data;
  },
};

export default ocrService;