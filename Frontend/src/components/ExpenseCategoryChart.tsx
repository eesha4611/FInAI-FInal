import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import transactionService from "../services/transaction.service";

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryData {
  category: string;
  total: number;
}

const ExpenseCategoryChart = () => {
  const [data, setData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const res = await transactionService.getTransactions();

        if (res.success && res.data?.transactions) {
          const expenses = res.data.transactions.filter(
            (t: any) => t.type === "expense"
          );

          const grouped: Record<string, number> = {};

          expenses.forEach((t: any) => {
            grouped[t.category] =
              (grouped[t.category] || 0) + Number(t.amount);
          });

          const formatted = Object.keys(grouped).map(cat => ({
            category: cat,
            total: grouped[cat]
          }));

          setData(formatted);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  if (loading) return <p>Loading chart...</p>;
  if (!data.length) return <p>No expense data</p>;

  const chartData = {
    labels: data.map(d => d.category),
    datasets: [
      {
        data: data.map(d => d.total),
        backgroundColor: [
          "#6366F1",
          "#22C55E",
          "#F59E0B",
          "#EF4444",
          "#06B6D4",
          "#8B5CF6",
          "#F472B6",
          "#14B8A6"
        ]
      }
    ]
  };

  return (
    <div className="flex justify-center items-center w-full h-80">
    <div className="w-72">
      <Pie data={chartData} />
    </div>
    </div>


  );
};

export default ExpenseCategoryChart;
