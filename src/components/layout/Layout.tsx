import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
}

const pageTitles: Record<string, string> = {
  "/users": "المستخدمين",
  "/roles": "الأدوار",
  "/products": "المنتجات",
  "/orders": "الطلبات",
  "/categories": "الفئات",
  "/": "لوحة التحكم",
};

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "لوحة التحكم";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Header title={title} />
        <main className="flex-1 overflow-y-auto bg-muted/50 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
