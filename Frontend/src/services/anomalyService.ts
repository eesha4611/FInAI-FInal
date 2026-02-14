import api from './api';

export interface Anomaly {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  location: string;
  severity: 'high' | 'medium' | 'low';
  confidence: number;
  reason: string;
  status: 'pending' | 'resolved';
  resolvedAs?: 'legitimate' | 'fraud';
  suggestedAction?: string;
}

export const anomalyService = {
  // GET all anomalies
  getAll: async () => {
    const response = await api.get('/anomalies');
    return response.data;
  },

  // GET anomalies by status
  getByStatus: async (status: 'pending' | 'resolved') => {
    const response = await api.get(`/anomalies?status=${status}`);
    return response.data;
  },

  // POST resolve anomaly
  resolve: async (id: string, action: 'legitimate' | 'fraud') => {
    const response = await api.post(`/anomalies/${id}/resolve`, { action });
    return response.data;
  },

  // GET anomaly statistics
  getStats: async () => {
    const response = await api.get('/anomalies/stats');
    return response.data;
  },
};

export default anomalyService;