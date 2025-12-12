"use client";

import { useState } from "react";
import { useBudgetStore } from "@/store/budgetStore";

export default function SyncButton() {
  const sync = useBudgetStore((s) => s.syncToServer); 
  const [status, setStatus] = useState<"idle" | "syncing" | "success" | "error">("idle");

  const handleSync = async () => {
    setStatus("syncing");
    try {
      await sync();
      setStatus("success");
      setTimeout(() => setStatus("idle"), 1500);
    } catch (err) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  const baseStyle =
    "w-full px-4 py-2 rounded-md font-medium text-center transition-all text-white";

  const bg =
    status === "syncing"
      ? "bg-yellow-600"
      : status === "success"
      ? "bg-green-600"
      : status === "error"
      ? "bg-red-600"
      : "bg-blue-600";

  const text =
    status === "syncing"
      ? "Syncing..."
      : status === "success"
      ? "Synced ✓"
      : status === "error"
      ? "Failed!"
      : "Sync Now";

  return (
    <button onClick={handleSync} className={`${baseStyle} ${bg}`}>
      {text}
    </button>
  );
}
