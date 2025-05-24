import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigationStore } from '@/stores/navigation-store';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// We'll use dynamic imports for Tauri API to avoid build errors in web mode

interface HeaderProps {
  toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { toggleSidebar: toggleDesktopSidebar, isMobileView } = useNavigationStore();
  // Track dark mode for potential theme-specific customizations
  // We'll track dark mode state in the future if needed for theme customization
  const [isTauri, setIsTauri] = useState(false);

  // We'll implement dark mode detection in the future if needed
  // This would be used to customize the title bar appearance based on theme

  // Detect if running in Tauri
  useEffect(() => {
    const checkTauri = async () => {
      try {
        // Check if the Tauri API is available in the window object
        if (typeof window !== 'undefined' && 'object' === typeof (window as any).__TAURI__) {
          setIsTauri(true);
        } else {
          setIsTauri(false);
        }
      } catch (e) {
        setIsTauri(false);
      }
    };
    
    checkTauri();
  }, []);

  const handleLogoClick = () => {
    if (isMobileView) {
      toggleSidebar?.();
    } else {
      toggleDesktopSidebar();
    }
  };
  
  // We're tracking isDarkMode for future use cases where we might want to
  // customize the title bar appearance based on the theme
  
  // Using isDarkMode for potential future theme-specific customizations
  
  // Window control handlers for custom title bar
  const [isMaximized, setIsMaximized] = useState(false);
  // We don't need to store the appWindow reference since we're using the global __TAURI__ object directly
  
  // Initialize the window reference
  useEffect(() => {
    if (isTauri) {
      // For Tauri 2.5.1, we need to use the global __TAURI__ object directly
      // This is more reliable than the dynamic import approach
      try {
        if (typeof window !== 'undefined' && (window as any).__TAURI__) {
          setIsTauri(true);
          
          // Check if window is maximized
          const checkMaximized = async () => {
            try {
              const isMax = await (window as any).__TAURI__.window.appWindow.isMaximized();
              setIsMaximized(isMax);
            } catch (e) {
              console.error('Failed to check if window is maximized:', e);
            }
          };
          
          checkMaximized();
        }
      } catch (e) {
        console.error('Failed to initialize Tauri window:', e);
      }
    }
  }, []);
  
  const handleMinimize = async () => {
    if (isTauri) {
      try {
        await (window as any).__TAURI__.window.appWindow.minimize();
      } catch (e) {
        console.error('Failed to minimize window:', e);
      }
    }
  };
  
  const handleMaximize = async () => {
    if (isTauri) {
      try {
        const isCurrentlyMaximized = await (window as any).__TAURI__.window.appWindow.isMaximized();
        if (isCurrentlyMaximized) {
          await (window as any).__TAURI__.window.appWindow.unmaximize();
        } else {
          await (window as any).__TAURI__.window.appWindow.maximize();
        }
        // Update the maximized state
        setIsMaximized(await (window as any).__TAURI__.window.appWindow.isMaximized());
      } catch (e) {
        console.error('Failed to maximize/restore window:', e);
      }
    }
  };
  
  const handleClose = async () => {
    if (isTauri) {
      try {
        await (window as any).__TAURI__.window.appWindow.close();
      } catch (e) {
        console.error('Failed to close window:', e);
      }
    }
  };
  
  // Listen for window resize events to update maximize button state
  useEffect(() => {
    if (isTauri) {
      // Use a simple interval to check window state
      const checkInterval = setInterval(async () => {
        try {
          const maximized = await (window as any).__TAURI__.window.appWindow.isMaximized();
          setIsMaximized(maximized);
        } catch (e) {
          console.error('Error checking window state:', e);
        }
      }, 500);
      
      return () => {
        clearInterval(checkInterval);
      };
    }
  }, [isTauri]);

  // Add double-click handler for maximizing/restoring the window
  const handleHeaderDoubleClick = async () => {
    if (isTauri) {
      try {
        const isCurrentlyMaximized = await (window as any).__TAURI__.window.appWindow.isMaximized();
        if (isCurrentlyMaximized) {
          await (window as any).__TAURI__.window.appWindow.unmaximize();
        } else {
          await (window as any).__TAURI__.window.appWindow.maximize();
        }
        // Update the maximized state
        setIsMaximized(await (window as any).__TAURI__.window.appWindow.isMaximized());
      } catch (e) {
        console.error('Failed to toggle maximize on double-click:', e);
      }
    }
  };

  return (
    <header 
      data-tauri-drag-region
      onDoubleClick={handleHeaderDoubleClick}
      className={cn(
        "h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900",
        "flex items-center px-4 sticky top-0 z-10",
        // Make the header draggable in Tauri mode with appropriate cursor
        isTauri && "cursor-move",
        // Add padding for the title bar area in Tauri mode
        isTauri && "pt-2"
      )}
    >
      <div className="flex items-center justify-between w-full">
        {/* Left section with logo and app name */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogoClick}
            className={cn("mr-2", isTauri && "tauri-no-drag")}
            aria-label="Toggle sidebar"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
            >
              {/* Simple placeholder logo - replace with actual logo SVG */}
              <path 
                d="M12 2L2 7L12 12L22 7L12 2Z" 
                fill="currentColor" 
                stroke="currentColor" 
                strokeWidth="1.5" 
              />
              <path 
                d="M2 17L12 22L22 17" 
                stroke="currentColor" 
                strokeWidth="1.5" 
              />
              <path 
                d="M2 12L12 17L22 12" 
                stroke="currentColor" 
                strokeWidth="1.5" 
              />
            </svg>
          </Button>
          
          <h1 className="font-bold text-lg tracking-wide hidden md:block">ONE</h1>
        </div>
        
        {/* Center section with search bar */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 hidden md:block">
          <div className={cn("relative", isTauri && "tauri-no-drag")}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full py-2 pl-10 pr-4 rounded-lg bg-gray-100 dark:bg-gray-800 border-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>
        
        {/* Right section with notification, user icons, and window controls */}
        <div className={cn("flex items-center gap-2", isTauri && "tauri-no-drag")}>
          <Button variant="ghost" size="icon" className="text-gray-500">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500">
            <User className="h-5 w-5" />
          </Button>
          
          {/* Window controls - only shown in Tauri desktop mode, not in web or mobile */}
          {isTauri && !isMobileView && (
            <div className="window-controls flex items-center ml-4">
              <button 
                onClick={handleMinimize}
                className="window-control"
                aria-label="Minimize"
              >
                <svg width="10" height="1" viewBox="0 0 10 1">
                  <rect width="10" height="1" fill="currentColor"/>
                </svg>
              </button>
              <button 
                onClick={handleMaximize}
                className="window-control"
                aria-label="Maximize"
              >
                {isMaximized ? (
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <path d="M2 2H8V8H2V2Z" stroke="currentColor" fill="none" strokeWidth="1"/>
                  </svg>
                ) : (
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <rect width="10" height="10" stroke="currentColor" fill="none" strokeWidth="1"/>
                  </svg>
                )}
              </button>
              <button 
                onClick={handleClose}
                className="window-control close"
                aria-label="Close"
              >
                <svg width="10" height="10" viewBox="0 0 10 10">
                  <path d="M0 0 L10 10 M10 0 L0 10" stroke="currentColor" strokeWidth="1"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
