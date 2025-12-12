"use client";

import { useBudgetStore } from "@/store/budgetStore";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";


ChartJS.register(ArcElement, Tooltip, Legend);

export default function DashboardPage() {
  const { budget, loadBudget } = useBudgetStore();
  const [expenses, setExpenses] = useState(0);
  const [warnings, setWarnings] = useState<string[]>([]);

  useEffect(() => {
    loadBudget();
  }, []);

  useEffect(() => {
    const total =
      budget.bills +
      budget.food +
      budget.transport +
      budget.subscriptions +
      budget.misc;

    setExpenses(total);

    const w: string[] = [];

    // ------------------ WARNINGS ------------------
    if (budget.income > 0) {
      if (budget.subscriptions > budget.income * 0.3)
        w.push("Subscriptions are above 30% of your income!");

      if (budget.food > budget.income * 0.4)
        w.push("Food expenses are too high!");

      if (total > budget.income)
        w.push("Your total expenses exceed your income!");
    }

    if (budget.income - total < 0) {
      w.push("Savings are NEGATIVE. You are overspending!");
    }

    setWarnings(w);
  }, [budget]);

  // ------------------ METRICS ------------------
  const burnRate =
    budget.income > 0 ? (expenses / budget.income) * 100 : 0;

  const savings = budget.income - expenses;

  // ------------------ CHART DATA ------------------
  const pieData = {
    labels: ["Bills", "Food", "Transport", "Subscriptions", "Misc"],
    datasets: [
      {
        data: [
          budget.bills,
          budget.food,
          budget.transport,
          budget.subscriptions,
          budget.misc,
        ],
        backgroundColor: [
          "#4C8BF5",
          "#ED6A5A",
          "#5BC0BE",
          "#F4A261",
          "#B388EB",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <AuthGuard>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-800 rounded-lg">
          <p className="font-medium">Burn Rate</p>
          <p className="text-xl">{burnRate.toFixed(1)}%</p>
        </div>

        <div className="p-4 bg-gray-800 rounded-lg">
          <p className="font-medium">Savings Potential</p>
          <p className="text-xl">{savings}</p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="p-4 bg-gray-800 rounded-lg">
        <h2 className="font-bold mb-2">Expenses Breakdown</h2>
        <Pie data={pieData} />
      </div>

      {/* WARNINGS */}
      {warnings.length > 0 && (
        <div className="p-4 bg-red-800 rounded-lg mt-4">
          <h2 className="font-bold text-red-300 mb-2">Warnings</h2>
          <ul className="list-disc ml-6 text-red-100 space-y-1">
            {warnings.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
    </AuthGuard>
  );
}
