import api from './api';

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  isAnomaly?: boolean;
  receiptImage?: string;
}

export const expenseService = {
  // GET all expenses
  getAll: async () => {
    const response = await api.get('/expenses');
    return response.data;
  },

  // GET single expense
  getById: async (id: string) => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },

  // POST create new expense
  create: async (expense: Omit<Expense, 'id'>) => {
    const response = await api.post('/expenses', expense);
    return response.data;
  },

  // PUT update expense
  update: async (id: string, expense: Partial<Expense>) => {
    const response = await api.put(`/expenses/${id}`, expense);
    return response.data;
  },

  // DELETE expense
  delete: async (id: string) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  },
};

export default expenseService;