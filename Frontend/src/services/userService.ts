import api from './api';

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  institution?: string;
  course?: string;
  year?: string;
  monthlyIncome: number;
  monthlyBudget: number;
}

export interface BudgetSettings {
  monthlyBudget: number;
  notifyAt: number;
  categoryBudgets: Array<{
    category: string;
    budget: number;
  }>;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  anomalies: boolean;
  predictions: boolean;
  weeklyReport: boolean;
}

export const userService = {
  // GET user profile
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  // PUT update profile
  updateProfile: async (profile: Partial<UserProfile>) => {
    const response = await api.put('/user/profile', profile);
    return response.data;
  },

  // GET budget settings
  getBudget: async () => {
    const response = await api.get('/user/budget');
    return response.data;
  },

  // PUT update budget
  updateBudget: async (budget: Partial<BudgetSettings>) => {
    const response = await api.put('/user/budget', budget);
    return response.data;
  },

  // GET notification settings
  getNotifications: async () => {
    const response = await api.get('/user/notifications');
    return response.data;
  },

  // PUT update notification settings
  updateNotifications: async (settings: Partial<NotificationSettings>) => {
    const response = await api.put('/user/notifications', settings);
    return response.data;
  },

  // PUT change password
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put('/user/password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

export default userService;