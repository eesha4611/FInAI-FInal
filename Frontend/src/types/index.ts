export interface User {
  id: string;
  name: string;
  email: string;
  monthlyIncome: number;
  monthlyBudget: number;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  isAnomaly: boolean;
  receiptImage?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  budget: number;
  spent: number;
}

export interface Prediction {
  month: string;
  predictedAmount: number;
  confidence: number;
}

export interface Anomaly {
  id: string;
  expense: Expense;
  reason: string;
  severity: 'low' | 'medium' | 'high';
}

export interface DashboardStats {
  totalSpent: number;
  budgetLeft: number;
  predictedExpense: number;
  anomalyCount: number;
}

export {}; // Add this to fix isolatedModules error