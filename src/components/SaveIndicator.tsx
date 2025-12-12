"use client";
import { useBudgetStore } from "@/store/budgetStore";

export default function SaveIndicator() {
  const saveStatus = useBudgetStore((s) => s.saveStatus);

  if (saveStatus === "idle") return null;

  const bg =
    saveStatus === "saving" ? "bg-yellow-600" :
    saveStatus === "saved" ? "bg-green-600" :
    "bg-red-600";

  const text =
    saveStatus === "saving" ? "Saving..." :
    saveStatus === "saved" ? "Saved" :
    "Error saving data";

  return (
    <div className={`${bg} w-full text-center p-2 text-sm font-semibold`}>
      {text}
    </div>
  );
}
