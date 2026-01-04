import { useSidebarStore } from "@/stores/useSidebarStore";
import { Button } from "@/components/ui/button";
import { Menu, PanelLeftClose } from "lucide-react";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { isOpen, toggle } = useSidebarStore();

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
      <h1 className="text-xl font-semibold">{title}</h1>
    </header>
  );
}
