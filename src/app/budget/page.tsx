"use client";
import { useBudgetStore } from "@/store/budgetStore";
import { useEffect } from "react";
import AuthGuard from "@/components/AuthGuard";


export default function BudgetPage() {
  const { budget, setField, loadBudget } = useBudgetStore();

  useEffect(() => {
    loadBudget();
  }, []);

  const fields = [
    { key: "income", label: "Monthly Income" },
    { key: "bills", label: "Monthly Bills" },
    { key: "food", label: "Food" },
    { key: "transport", label: "Transport" },
    { key: "subscriptions", label: "Subscriptions" },
    { key: "misc", label: "Miscellaneous" },
  ] as const;

  return (
  <AuthGuard>
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Monthly Budget</h1>

      <div className="space-y-4">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="block font-medium mb-1">{f.label}</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={budget[f.key]}
              onChange={(e) => setField(f.key, Number(e.target.value))}
            />
          </div>
        ))}
      </div>
    </div>
    </AuthGuard>
  );
}
