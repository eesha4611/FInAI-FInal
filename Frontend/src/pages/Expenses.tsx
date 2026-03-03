import React, { useState, useEffect, useCallback } from 'react';
import TransactionForm from '../components/TransactionForm';
import transactionService from '../services/transaction.service';
import {
  PlusIcon,
  EllipsisHorizontalIcon,
  XMarkIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface Transaction {
  id: number;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description?: string;
  createdAt?: string;
  created_at?: string;
}

const CATEGORIES = [
  "All",
  "Food & Dining",
  "Shopping",
  "Transport",
  "Entertainment",
  "Bills",
  "Healthcare",
  "Education",
  "Other"
];

const Expenses: React.FC = () => {

  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [selectedYear, setSelectedYear] = useState<number>(0);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 100000;

  const fetchExpensesData = useCallback(async () => {
    try {
      // Build query string manually to ensure month/year are always included
      let queryString = `page=${page}&limit=${limit}`;
      
      if (selectedCategory !== "All") {
        queryString += `&category=${selectedCategory}`;
      }
      
      // Always add month and year if they exist
      if (selectedMonth && selectedYear) {
        queryString += `&month=${selectedMonth}&year=${selectedYear}`;
      }
      
      const response: any = await transactionService.getTransactions(`?${queryString}`);

      if (response.success && response.data) {
        const expensesData = (response.data.transactions || []).map((t: any) => ({
          id: t.id,
          amount: Number(t.amount),
          type: t.type,
          category: t.category,
          description: t.description,
          createdAt: t.created_at
        }));

        setTransactions(expensesData);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (error) {
      console.error("Expenses fetch error:", error);
    }
  }, [selectedCategory, selectedMonth, selectedYear, page, limit]);

  // Call fetchExpensesData when dependencies change
  useEffect(() => {
    fetchExpensesData();
  }, [fetchExpensesData]);

const filteredTransactions = (transactions || []).filter((t) => {
  if (t.type !== "expense") return false;

  if (selectedCategory === "All") return true;

  return t.category === selectedCategory;
});
  const formatCurrency = (amount: number) => {
    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };
  return (
    <div className="space-y-8">

      <div className="flex flex-col md:flex-row md:items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">Expenses</h1>
          <p className="text-gray-600">Track and manage all your expenses</p>
        </div>

        <button
          onClick={() => setShowAddExpenseModal(true)}
          className="btn-primary flex items-center mt-4 md:mt-0"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Expense
        </button>

      </div>

      <div className="card">
        {/* Category Filters - Moved to Top */}
        <div className="flex space-x-2 mt-6 overflow-x-auto pb-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
          
          {/* Month Selector */}
          <div className="flex items-center space-x-4">
            <CalendarIcon className="h-5 w-5 text-gray-400" />
            <select
  value={
    selectedMonth && selectedYear
      ? `${selectedMonth}-${selectedYear}`
      : ""
  }
  onChange={(e) => {
  if (e.target.value === "") {
    setSelectedMonth(0);
    setSelectedYear(0);
  } else {
    const [month, year] = e.target.value.split("-");
    setSelectedMonth(Number(month));
    setSelectedYear(Number(year));
  }
}}
  className="input-field py-2"
>
  <option value="">All Time</option>

  {(() => {
    const currentYear = new Date().getFullYear();
    const years = [currentYear, currentYear - 1, currentYear - 2];

    return years.flatMap((year) =>
      Array.from({ length: 12 }, (_, i) => {
        const monthNumber = i + 1;
        const monthName = new Date(year, i).toLocaleString("default", {
          month: "long",
        });

        return (
          <option
            key={`${monthNumber}-${year}`}
            value={`${monthNumber}-${year}`}
          >
            {monthName} {year}
          </option>
        );
      })
    );
  })()}
</select>
          </div>
        </div>
      </div>

      <div className="card">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Description</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Category</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredTransactions.map((transaction) => {

                const date = transaction.createdAt || transaction.created_at;

                return (

                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">

                    <td className="py-3 px-4">
                      {transaction.description || "No description"}
                    </td>

                    <td className="py-3 px-4">
                      {transaction.category}
                    </td>

                    <td className="py-3 px-4 font-semibold">
                      {formatCurrency(transaction.amount)}
                    </td>

                    <td className="py-3 px-4">
                      {date ? new Date(date).toLocaleDateString() : "No date"}
                    </td>

                    <td className="py-3 px-4">
                      <EllipsisHorizontalIcon className="h-5 w-5 text-gray-500" />
                    </td>

                  </tr>

                );

              })}

            </tbody>

          </table>

        </div>

        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">

          <p className="text-sm text-gray-600">
            Showing {filteredTransactions.length} expenses
          </p>

          <div className="flex items-center space-x-2">

            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (

              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 rounded ${
                  page === p
                    ? "bg-primary-600 text-white"
                    : "border hover:bg-gray-50"
                }`}
              >
                {p}
              </button>

            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>

          </div>

        </div>

      </div>

      {showAddExpenseModal && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-xl font-semibold">Add Expense</h2>

              <button onClick={() => setShowAddExpenseModal(false)}>
                <XMarkIcon className="h-6 w-6" />
              </button>

            </div>

            <TransactionForm
              onTransactionAdded={() => {
                setShowAddExpenseModal(false);
                fetchExpensesData();
              }}
            />

          </div>

        </div>

      )}

    </div>
  );
};

export default Expenses;