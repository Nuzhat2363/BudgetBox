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

// 💡 ALWAYS SAFE DEFAULT
const DEFAULT_BUDGET: BudgetData = {
  income: 0,
  bills: 0,
  food: 0,
  transport: 0,
  subscriptions: 0,
  misc: 0,
};

interface BudgetState {
  budget: BudgetData;
  isSaving: boolean;
  saveStatus: SaveStatus;

  setField: (key: keyof BudgetData, value: number) => Promise<void>;
  loadBudget: () => Promise<void>;
  syncToServer: () => Promise<{ success: boolean }>;
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  budget: DEFAULT_BUDGET,
  isSaving: false,
 saveStatus: "idle" as SaveStatus,

  //-------------------------------------------
  // UPDATE FIELD + AUTO SAVE
  //-------------------------------------------
  setField: async (key, value) => {
    const updated = { ...get().budget, [key]: value };

    set({ budget: updated, isSaving: true, saveStatus: "saving" });

    try {
      await localforage.setItem("budget", updated);
      set({ isSaving: false, saveStatus: "saved" });

      setTimeout(() => set({ saveStatus: "idle" }), 1500);
    } catch (err) {
      console.error("Failed to save budget:", err);
      set({ isSaving: false, saveStatus: "error" });
    }
  },

  //-------------------------------------------
  // LOAD BUDGET (SERVER + LOCAL FALLBACK SAFE)
  //-------------------------------------------
  loadBudget: async () => {
    try {
      const res = await fetch("https://heroic-smile-production-6647.up.railway.app/load");
      const data = await res.json();

      if (data?.success && data?.data) {
        set({ budget: { ...DEFAULT_BUDGET, ...data.data } });
        return;
      }
    } catch (err) {
      console.error("Failed to load from server:", err);
    }

    // FALLBACK → TRY LOCALFORAGE
    try {
      const saved = await localforage.getItem("budget");
      if (saved) {
        set({ budget: { ...DEFAULT_BUDGET, ...(saved as BudgetData) } });
        return;
      }
    } catch {}

    // FINAL GUARANTEE → DEFAULT
    set({ budget: DEFAULT_BUDGET });
  },

  //-------------------------------------------
  // SYNC TO SERVER
  //-------------------------------------------
  syncToServer: async () => {
    try {
      const budget = get().budget;

      const res = await fetch("https://heroic-smile-production-6647.up.railway.app/save", {
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
