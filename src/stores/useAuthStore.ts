import { create } from "zustand";
import { User } from "@/types/api/auth";

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User, rememberMe?: boolean) => void;
  logout: () => void;
  initialize: () => void;
}

// قراءة البيانات من localStorage أو sessionStorage
const getStoredAuth = () => {
  try {
    // محاولة قراءة من localStorage أولاً
    let token = localStorage.getItem("token");
    let userStr = localStorage.getItem("user");
    
    // إذا لم يكن موجوداً في localStorage، جرب sessionStorage
    if (!token) {
      token = sessionStorage.getItem("token");
      userStr = sessionStorage.getItem("user");
    }
    
    const user = userStr ? JSON.parse(userStr) : null;
    return { token, user, isAuthenticated: !!token && !!user };
  } catch {
    return { token: null, user: null, isAuthenticated: false };
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  ...getStoredAuth(),
  login: (token: string, user: User, rememberMe = false) => {
    if (rememberMe) {
      // حفظ في localStorage (دائم)
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      // التأكد من حذفها من sessionStorage
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    } else {
      // حفظ في sessionStorage (مؤقت)
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));
      // التأكد من حذفها من localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    set({ token, user, isAuthenticated: true });
  },
  logout: () => {
    // حذف من كلا المكانين
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    set({ token: null, user: null, isAuthenticated: false });
  },
  initialize: () => {
    const stored = getStoredAuth();
    set(stored);
  },
}));
