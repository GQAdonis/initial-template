import { useNavigationStore } from '@/stores/navigation-store';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const { items, activePath, setActivePath, sidebarExpanded, isMobileView, setMobileView } = useNavigationStore();
  const isMobile = useIsMobile();

  // Update mobile view state when screen size changes
  useEffect(() => {
    setMobileView(!!isMobile);
  }, [isMobile, setMobileView]);

  // Handle navigation item click
  const handleNavClick = (path: string) => {
    setActivePath(path);
    // In a real app, you would use a router to navigate
    // router.push(path);
  };

  // Render mobile bottom navigation
  if (isMobileView) {
    // Filter out settings for bottom navigation
    const bottomNavItems = items.filter(item => item.path !== '/settings');
    
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 h-16 z-10">
        <div className="flex items-center justify-around h-full px-2">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full",
                  activePath === item.path
                    ? "text-yellow-500"
                    : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
                )}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs mt-1">{item.name}</span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  // Render desktop sidebar navigation
  return (
    <nav className={cn(
      "h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300",
      sidebarExpanded ? "w-60" : "w-16"
    )}>
      <div className="flex flex-col h-full py-4">
        <div className="space-y-1 px-2 flex-1">
          {items.filter(item => item.path !== '/settings').map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 transition-colors",
                  activePath === item.path
                    ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-500"
                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-300",
                  !sidebarExpanded && "justify-center"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {sidebarExpanded && (
                  <span className="ml-3 truncate">{item.name}</span>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Settings pinned to bottom */}
        <div className="px-2 mt-auto border-t border-gray-200 dark:border-gray-800 pt-4">
          {items.filter(item => item.path === '/settings').map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 transition-colors",
                  activePath === item.path
                    ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-500"
                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-300",
                  !sidebarExpanded && "justify-center"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {sidebarExpanded && (
                  <span className="ml-3 truncate">{item.name}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
