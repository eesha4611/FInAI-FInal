import api from './api';

export interface ScanResult {
  amount: number;
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

  // GET scan history
  getHistory: async () => {
    const response = await api.get('/ocr/history');
    return response.data;
  },
};

export default ocrService;