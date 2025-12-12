import { create } from "zustand";
import localforage from "localforage";

export interface BudgetData {
  income: number;
  bills: number;
  food: number;
  transport: number;
  subscriptions: number;
  misc: number;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

interface BudgetState {
  budget: BudgetData;
  isSaving: boolean;
  saveStatus: SaveStatus;

  setField: (key: keyof BudgetData, value: number) => Promise<void>;
  loadBudget: () => Promise<void>;
  syncToServer: () => Promise<{ success: boolean }>;
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  budget: {
    income: 0,
    bills: 0,
    food: 0,
    transport: 0,
    subscriptions: 0,
    misc: 0,
  },

  isSaving: false,
  saveStatus: "idle" as SaveStatus,


  // -------------------------
  // UPDATE FIELD + AUTO SAVE
  // -------------------------
  setField: async (key, value) => {
    const updated = { ...get().budget, [key]: value };

    // instant UI update
    set({ budget: updated, isSaving: true, saveStatus: "saving" });

    try {
      await localforage.setItem("budget", updated);

      // success
      set({ isSaving: false, saveStatus: "saved" });

      // hide saved after delay
      setTimeout(() => set({ saveStatus: "idle" }), 1500);
    } catch (err) {
      console.error("Failed to save budget:", err);
      set({ isSaving: false, saveStatus: "error" });
    }
  },

  // -------------------------
  // LOAD BUDGET FROM STORAGE
  // -------------------------
  loadBudget: async () => {
    try {
      const saved = await localforage.getItem<BudgetData>("budget");
      if (saved) set({ budget: saved });
    } catch (err) {
      console.error("Failed to load budget:", err);
    }
  },

  // -------------------------
  // FAKE SYNC TO SERVER (FRONTEND ASSIGNMENT)
  // -------------------------
  syncToServer: async () => {
  try {
    const budget = get().budget;

    const res = await fetch("http://localhost:4000/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(budget),
    });

    const data = await res.json();
    return { success: data.success };
  } catch (err) {
    console.error("Sync failed:", err);
    return { success: false };
  }
},

}));
