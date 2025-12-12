import { create } from "zustand";

interface AuthState {
  userEmail: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: () => boolean;
  loadFromStorage: () => void;
}

const HARD_EMAIL = "hire-me@anshumat.org";
const HARD_PASSWORD = "HireMe@2025!";

export const useAuthStore = create<AuthState>((set, get) => ({
  userEmail: null,

  login: (email, password) => {
    if (email === HARD_EMAIL && password === HARD_PASSWORD) {
      // successful login
      set({ userEmail: email });
      try {
        localStorage.setItem("budgetbox_user", email);
      } catch (e) {
        // ignore
      }
      return true;
    }
    return false;
  },

  logout: () => {
    set({ userEmail: null });
    try {
      localStorage.removeItem("budgetbox_user");
    } catch (e) {}
  },

  isAuthenticated: () => {
    return get().userEmail !== null;
  },

  loadFromStorage: () => {
    try {
      const email = localStorage.getItem("budgetbox_user");
      if (email) set({ userEmail: email });
    } catch (e) {}
  },
}));
