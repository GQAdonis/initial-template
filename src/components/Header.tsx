import { Search, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigationStore } from '@/stores/navigation-store';

interface HeaderProps {
  toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { toggleSidebar: toggleDesktopSidebar, isMobileView } = useNavigationStore();

  const handleLogoClick = () => {
    if (isMobileView) {
      toggleSidebar?.();
    } else {
      toggleDesktopSidebar();
    }
  };

  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center px-4 sticky top-0 z-10">
      <div className="flex items-center justify-between w-full">
        {/* Left section with logo and app name */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogoClick}
            className="mr-2"
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full py-2 pl-10 pr-4 rounded-lg bg-gray-100 dark:bg-gray-800 border-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>
        
        {/* Right section with notification and user icons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-gray-500">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
