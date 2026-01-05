import { ReactNode, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, token, initialize } = useAuthStore();

  useEffect(() => {
    // التأكد من تهيئة auth store
    initialize();
  }, [initialize]);

  // التحقق من وجود token في localStorage
  const hasToken = token || localStorage.getItem('token');

  if (!isAuthenticated || !hasToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

