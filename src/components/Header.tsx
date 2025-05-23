import { Search, Bell, User, Minus, Square, X } from 'lucide-react';
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTauri, setIsTauri] = useState(false);

  // Detect dark mode
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches || document.documentElement.classList.contains('dark'));
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };
    
    darkModeMediaQuery.addEventListener('change', handleChange);
    
    // Also check for theme changes in the DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => {
      darkModeMediaQuery.removeEventListener('change', handleChange);
      observer.disconnect();
    };
  }, []);

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
  
  // Window control handlers
  // We're tracking isDarkMode for future use cases where we might want to
  // customize the title bar appearance based on the theme
  
  // Using isDarkMode for potential future theme-specific customizations
  
  // Window control handlers using direct Tauri API calls
  const handleMinimize = async () => {
    if (isTauri) {
      try {
        // Use the WebView API to send a message to the Rust backend
        const tauriAPI = (window as any).__TAURI__;
        if (tauriAPI && tauriAPI.window) {
          await tauriAPI.window.appWindow.minimize();
        }
      } catch (e) {
        console.error('Failed to minimize window:', e);
      }
    }
  };
  
  const handleMaximize = async () => {
    if (isTauri) {
      try {
        // Use the WebView API to send a message to the Rust backend
        const tauriAPI = (window as any).__TAURI__;
        if (tauriAPI && tauriAPI.window) {
          const isMaximized = await tauriAPI.window.appWindow.isMaximized();
          if (isMaximized) {
            await tauriAPI.window.appWindow.unmaximize();
          } else {
            await tauriAPI.window.appWindow.maximize();
          }
        }
      } catch (e) {
        console.error('Failed to maximize/restore window:', e);
      }
    }
  };
  
  const handleClose = async () => {
    if (isTauri) {
      try {
        // Use the WebView API to send a message to the Rust backend
        const tauriAPI = (window as any).__TAURI__;
        if (tauriAPI && tauriAPI.window) {
          await tauriAPI.window.appWindow.close();
        }
      } catch (e) {
        console.error('Failed to close window:', e);
      }
    }
  };

  return (
    <header 
      data-tauri-drag-region
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
            className={cn("mr-2", isTauri && "data-tauri-drag-cancel")}
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
          <div className={cn("relative", isTauri && "data-tauri-drag-cancel")}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full py-2 pl-10 pr-4 rounded-lg bg-gray-100 dark:bg-gray-800 border-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>
        
        {/* Right section with notification, user icons, and window controls */}
        <div className={cn("flex items-center gap-2", isTauri && "data-tauri-drag-cancel")}>
          <Button variant="ghost" size="icon" className="text-gray-500">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500">
            <User className="h-5 w-5" />
          </Button>
          
          {/* Window controls - only shown in Tauri desktop mode, not in web or mobile */}
          {isTauri && !isMobileView && (
            <div className="flex items-center ml-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full h-7 w-7"
                onClick={handleMinimize}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full h-7 w-7 mx-1"
                onClick={handleMaximize}
              >
                <Square className="h-3.5 w-3.5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-500 hover:bg-red-500 hover:text-white rounded-full h-7 w-7"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
