import { create } from 'zustand';
import { Home, MessageSquare, BookOpen, Image, Settings } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

// Define the types for our navigation items
interface NavigationItem {
  id: string;
  name: string;
  path: string;
  icon: React.ComponentType<any>;
}

// Define the store state
interface NavigationState {
  items: NavigationItem[];
  activePath: string;
  isMobileView: boolean;
  sidebarExpanded: boolean;
  chatSidebarExpanded: boolean;
  imageSidebarExpanded: boolean;
  setActivePath: (path: string) => void;
  setMobileView: (isMobile: boolean) => void;
  setSidebarExpanded: (expanded: boolean) => void;
  toggleSidebar: () => void;
  setChatSidebarExpanded: (expanded: boolean) => void;
  toggleChatSidebar: () => void;
  setImageSidebarExpanded: (expanded: boolean) => void;
  toggleImageSidebar: () => void;
}

// Create the store
export const useNavigationStore = create<NavigationState>((set) => ({
  // Initial navigation items
  items: [
    { id: uuidv4(), name: 'Home', path: '/', icon: Home },
    { id: uuidv4(), name: 'Chat', path: '/chat', icon: MessageSquare },
    { id: uuidv4(), name: 'Library', path: '/library', icon: BookOpen },
    { id: uuidv4(), name: 'Images', path: '/images', icon: Image },
    { id: uuidv4(), name: 'Settings', path: '/settings', icon: Settings },
  ],
  // Default active path
  activePath: '/',
  // Default mobile view state
  isMobileView: false,
  // Default sidebar state
  sidebarExpanded: true,
  // Default chat sidebar state
  chatSidebarExpanded: true,
  // Default image sidebar state
  imageSidebarExpanded: true,
  // Set active path
  setActivePath: (path) => set({ activePath: path }),
  // Set mobile view
  setMobileView: (isMobile) => set({ isMobileView: isMobile }),
  // Set sidebar expanded
  setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
  // Toggle sidebar
  toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
  // Set chat sidebar expanded
  setChatSidebarExpanded: (expanded) => set({ chatSidebarExpanded: expanded }),
  // Toggle chat sidebar
  toggleChatSidebar: () => set((state) => ({ chatSidebarExpanded: !state.chatSidebarExpanded })),
  // Set image sidebar expanded
  setImageSidebarExpanded: (expanded) => set({ imageSidebarExpanded: expanded }),
  // Toggle image sidebar
  toggleImageSidebar: () => set((state) => ({ imageSidebarExpanded: !state.imageSidebarExpanded })),
}));
