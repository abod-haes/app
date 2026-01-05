import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
          {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
