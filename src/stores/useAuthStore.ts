import { create } from "zustand";
import { User } from "@/types/api/auth";

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  initialize: () => void;
}

// قراءة البيانات من localStorage عند التهيئة
const getStoredAuth = () => {
  try {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    return { token, user, isAuthenticated: !!token && !!user };
  } catch {
    return { token: null, user: null, isAuthenticated: false };
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  ...getStoredAuth(),
  login: (token: string, user: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ token: null, user: null, isAuthenticated: false });
  },
  initialize: () => {
    const stored = getStoredAuth();
    set(stored);
  },
}));
