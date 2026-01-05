import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Shield, Package, ShoppingCart, X, Folder, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/stores/useSidebarStore";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useEffect, useState } from "react";

const navigation = [
  { name: "لوحة التحكم", href: "/", icon: LayoutDashboard },
  { name: "المستخدمين", href: "/users", icon: Users },
  { name: "الأدوار", href: "/roles", icon: Shield },
  { name: "المنتجات", href: "/products", icon: Package },
  { name: "الطلبات", href: "/orders", icon: ShoppingCart },
  { name: "الفئات", href: "/categories", icon: Folder },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const { isOpen, close, syncWithScreenSize } = useSidebarStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Initialize sidebar state based on screen size on first load
    syncWithScreenSize();
    
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Sync sidebar state with screen size on resize
      syncWithScreenSize();
    };

    // Set initial mobile state
      setIsMobile(window.innerWidth < 768);
    
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [syncWithScreenSize]);

  const sidebarContent = (
    <div className="flex h-full flex-col bg-[#151B2C] text-white w-full">
      <div className="flex h-16 items-center justify-between px-6 border-b border-white/10">
        <h2 className="text-xl font-bold">لوحة التحكم</h2>
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={close}
            className="text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item, index) => {
          const isActive = location.pathname === item.href;
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1 
              }}
            >
              <Link
              to={item.href}
              onClick={isMobile ? close : undefined}
              className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors relative",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
                </motion.div>
              <span>{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-l-lg"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
            </Link>
            </motion.div>
          );
        })}
      </nav>
    </div>
  );

  // Mobile: Sheet overlay
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
        <SheetContent side="left" className="w-64 p-0">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Flex sidebar
  if (!isOpen) {
    return null;
  }

  return (
    <motion.aside
      initial={{ x: 256, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 256, opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "flex w-64 h-screen flex-shrink-0",
        className
      )}
    >
      {sidebarContent}
    </motion.aside>
  );
}

export default Sidebar;
