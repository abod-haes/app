import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSidebarStore } from "@/stores/useSidebarStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Menu, PanelLeftClose, LogOut, User } from "lucide-react";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const navigate = useNavigate();
  const { isOpen, toggle } = useSidebarStore();
  const { user, logout } = useAuthStore();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleConfirmLogout = () => {
    logout();
    setLogoutDialogOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        className="lg:flex"
        aria-label={isOpen ? "إغلاق القائمة الجانبية" : "فتح القائمة الجانبية"}
      >
        {isOpen ? (
          <PanelLeftClose className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>
      <AnimatePresence mode="wait">
        <motion.h1
          key={title}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="text-xl font-semibold flex-1"
        >
          {title}
        </motion.h1>
      </AnimatePresence>

      <div className="flex items-center gap-2">
        {user && (
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>
              {user.firstName} {user.lastName}
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogoutClick}
          aria-label="تسجيل الخروج"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      <ConfirmDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        onConfirm={handleConfirmLogout}
        title="تسجيل الخروج"
        description="هل أنت متأكد من رغبتك في تسجيل الخروج؟ سيتم إنهاء جلستك الحالية."
        confirmText="تسجيل الخروج"
        cancelText="إلغاء"
        variant="destructive"
      />
    </header>
  );
}
