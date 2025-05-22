import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MessageSquare, BookOpen, Image, Settings } from 'lucide-react';

export type NavigationItem = {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
};

interface NavigationState {
  items: NavigationItem[];
  activeItem: string;
  sidebarExpanded: boolean;
  setActiveItem: (id: string) => void;
  toggleSidebar: () => void;
  setSidebarExpanded: (expanded: boolean) => void;
}

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set) => ({
      items: [
        {
          id: 'chat',
          name: 'Chat',
          icon: MessageSquare,
          path: '/'
        },
        {
          id: 'library',
          name: 'Library',
          icon: BookOpen,
          path: '/library'
        },
        {
          id: 'images',
          name: 'Images',
          icon: Image,
          path: '/images'
        },
        {
          id: 'settings',
          name: 'Settings',
          icon: Settings,
          path: '/settings'
        }
      ],
      activeItem: 'chat',
      sidebarExpanded: true,
      
      setActiveItem: (id) => set({ activeItem: id }),
      toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
      setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded })
    }),
    {
      name: 'prometheus-navigation-storage',
      partialize: (state) => ({ activeItem: state.activeItem, sidebarExpanded: state.sidebarExpanded }),
    }
  )
);