import React, { createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';

// Define the context type
type SidebarContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  variant: 'default' | 'floating';
  side: 'left' | 'right';
};

// Create the context with default values
const SidebarContext = createContext<SidebarContextType>({
  open: true,
  setOpen: () => {},
  variant: 'default',
  side: 'left',
});

// Provider props
interface SidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  variant?: 'default' | 'floating';
  side?: 'left' | 'right';
}

// Provider component
export const SidebarProvider = ({
  children,
  defaultOpen = true,
  variant = 'default',
  side = 'left',
}: SidebarProviderProps) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <SidebarContext.Provider value={{ open, setOpen, variant, side }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Hook to use the sidebar context
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

// Sidebar component
interface SidebarProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'floating';
  side?: 'left' | 'right';
}

export const Sidebar = ({
  children,
  className,
  variant = 'default',
  side = 'left',
}: SidebarProps) => {
  const { open } = useSidebar();

  return (
    <div
      className={cn(
        'h-full flex-shrink-0 overflow-hidden transition-all duration-300',
        variant === 'default' ? 'border-r border-gray-200 dark:border-gray-800' : '',
        variant === 'floating' ? 'md:border-r md:border-gray-200 md:dark:border-gray-800' : '',
        open ? 'w-64' : 'w-0 md:w-16',
        side === 'right' && 'order-last',
        className
      )}
    >
      <div className="h-full w-64 flex flex-col bg-white dark:bg-gray-900">
        {children}
      </div>
    </div>
  );
};

// Sidebar trigger component
interface SidebarTriggerProps {
  className?: string;
}

export const SidebarTrigger = ({ className }: SidebarTriggerProps) => {
  const { open, setOpen } = useSidebar();

  return (
    <button
      onClick={() => setOpen(!open)}
      className={cn(
        'p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors',
        className
      )}
      aria-label={open ? 'Close sidebar' : 'Open sidebar'}
    >
      <Menu size={20} />
    </button>
  );
};

// Sidebar header component
interface SidebarHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const SidebarHeader = ({ children, className }: SidebarHeaderProps) => {
  return (
    <div
      className={cn(
        'border-b border-gray-200 dark:border-gray-800',
        className
      )}
    >
      {children}
    </div>
  );
};

// Sidebar content component
interface SidebarContentProps {
  children: React.ReactNode;
  className?: string;
}

export const SidebarContent = ({ children, className }: SidebarContentProps) => {
  return (
    <div className={cn('flex-1 overflow-auto', className)}>
      {children}
    </div>
  );
};

// Sidebar menu component
interface SidebarMenuProps {
  children: React.ReactNode;
  className?: string;
}

export const SidebarMenu = ({ children, className }: SidebarMenuProps) => {
  return (
    <div className={cn('space-y-1', className)}>
      {children}
    </div>
  );
};

// Sidebar menu item component
interface SidebarMenuItemProps {
  children: React.ReactNode;
  className?: string;
}

export const SidebarMenuItem = ({ children, className }: SidebarMenuItemProps) => {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  );
};

// Sidebar menu button component
interface SidebarMenuButtonProps {
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const SidebarMenuButton = ({
  children,
  className,
  isActive = false,
  onClick,
}: SidebarMenuButtonProps) => {
  const { open } = useSidebar();

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
        isActive
          ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100',
        !open && 'md:justify-center',
        className
      )}
    >
      {children}
    </button>
  );
};

// Sidebar footer component
interface SidebarFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const SidebarFooter = ({ children, className }: SidebarFooterProps) => {
  return (
    <div
      className={cn(
        'border-t border-gray-200 dark:border-gray-800',
        className
      )}
    >
      {children}
    </div>
  );
};
