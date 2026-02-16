const API_BASE_URL = "http://localhost:5001/api";

interface CreateTransactionData {
  amount: number;
  type: "income" | "expense";
  category: string;
  description?: string;
}

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  return response.json();
}

export const transactionService = {
  async getTransactions() {
    return apiRequest("/transactions", { method: "GET" });
  },

  async addTransaction(data: CreateTransactionData) {
    return apiRequest("/transactions", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  async deleteTransaction(id: number) {
    return apiRequest(`/transactions/${id}`, {
      method: "DELETE"
    });
  }
};

export default transactionService;
