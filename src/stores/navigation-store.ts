import { create } from 'zustand';
import { Home, MessageSquare, BookOpen, Image, Settings } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

// Define the types for our navigation items
interface NavigationItem {
  id: string;
  path: string;
  name: string;
  icon: typeof MessageSquare;
}

// Define the store state
interface NavigationState {
  items: NavigationItem[];
  activePath: string;
  sidebarExpanded: boolean;
  isMobileView: boolean;
  setActivePath: (path: string) => void;
  toggleSidebar: () => void;
  setMobileView: (isMobile: boolean) => void;
}

// Create the store
export const useNavigationStore = create<NavigationState>((set) => ({
  // Initial navigation items
  items: [
    { id: uuidv4(), path: '/', name: 'Home', icon: Home },
    { id: uuidv4(), path: '/chat', name: 'Chat', icon: MessageSquare },
    { id: uuidv4(), path: '/library', name: 'Library', icon: BookOpen },
    { id: uuidv4(), path: '/images', name: 'Images', icon: Image },
    { id: uuidv4(), path: '/settings', name: 'Settings', icon: Settings },
  ],
  // Default active path
  activePath: '/',
  // Default sidebar state
  sidebarExpanded: true,
  // Default mobile view state
  isMobileView: false,
  // Set active path
  setActivePath: (path) => set({ activePath: path }),
  // Toggle sidebar
  toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
  // Set mobile view
  setMobileView: (isMobile) => set({ isMobileView: isMobile }),
}));
