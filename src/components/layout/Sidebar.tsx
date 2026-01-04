import { Link, useLocation } from "react-router-dom";
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
  const { isOpen, close } = useSidebarStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={isMobile ? close : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  // Mobile: Sheet overlay
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
        <SheetContent side="right" className="w-64 p-0">
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
    <aside
      className={cn(
        "flex w-64 h-screen flex-shrink-0 transition-all duration-300",
        className
      )}
    >
      {sidebarContent}
    </aside>
  );
}

export default Sidebar;
