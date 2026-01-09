import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { LoginPage } from "@/pages/Auth/LoginPage";
import { UsersPage } from "@/pages/Users/UsersPage";
import { RolesPage } from "@/pages/Roles/RolesPage";
import { ProductsPage } from "@/pages/Products/ProductsPage";
import { OrdersPage } from "@/pages/Orders/OrdersPage";
import { CategoriesPage } from "@/pages/Categories/CategoriesPage";
import { useAuthStore } from "@/stores/useAuthStore";
import "./App.css";
import DashboardPage from "./pages/Dashboard/DashboardPage";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

function AppContent() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    // تهيئة auth store من localStorage
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/roles" element={<RolesPage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
