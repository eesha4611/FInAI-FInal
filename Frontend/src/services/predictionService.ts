import api from './api';

export interface Prediction {
  month: string;
  predictedAmount: number;
  confidence: number;
}

export interface CategoryPrediction {
  category: string;
  current: number;
  predicted: number;
  change: string;
  risk: 'high' | 'medium' | 'low';
  suggestion: string;
}

export const predictionService = {
  // GET expense forecast
  getForecast: async (months: number = 3) => {
    const response = await api.get(`/predictions/forecast?months=${months}`);
    return response.data;
  },

  // GET category predictions
  getCategoryPredictions: async () => {
    const response = await api.get('/predictions/categories');
    return response.data;
  },

  // POST train model
  trainModel: async () => {
    const response = await api.post('/predictions/train');
    return response.data;
  },

  // GET accuracy metrics
  getAccuracy: async () => {
    const response = await api.get('/predictions/accuracy');
    return response.data;
  },
};

export default predictionService;