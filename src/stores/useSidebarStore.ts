import { create } from 'zustand';

interface SidebarState {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  syncWithScreenSize: () => void;
}

// Helper function to check if screen is mobile
const isMobileScreen = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

export const useSidebarStore = create<SidebarState>()((set) => ({
  // Initialize based on screen size: open on desktop, closed on mobile
  isOpen: typeof window !== 'undefined' ? !isMobileScreen() : true,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  syncWithScreenSize: () => {
    // Sync with screen size: open on desktop (>=768px), closed on mobile (<768px)
    if (typeof window !== 'undefined') {
      const mobile = isMobileScreen();
      set({ isOpen: !mobile });
    }
  },
}));

