import { useEffect, useState } from 'react';
import { useNavigationStore } from '@/stores/navigation-store';
import Header from './Header';
import Navigation from './Navigation';
import ChatLayout from './ChatLayout';
import HomeLayout from './HomeLayout';
import LibraryView from './LibraryView';
import ImageLayout from './ImageLayout';
import { useIsMobile } from '@/hooks/use-mobile';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ApplicationContainerProps {
  children?: React.ReactNode;
}

const ApplicationContainer: React.FC<ApplicationContainerProps> = ({ children }) => {
  const { activePath, isMobileView, setMobileView } = useNavigationStore();
  const isMobileCheck = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Update mobile view state when screen size changes
  useEffect(() => {
    setMobileView(!!isMobileCheck);
  }, [isMobileCheck, setMobileView]);

  // Update the document title based on the active path
  useEffect(() => {
    // Find the active navigation item
    const activeItem = useNavigationStore.getState().items.find(
      (item) => item.path === activePath
    );
    
    if (activeItem) {
      document.title = `One - ${activeItem.name}`;
    } else {
      document.title = 'One';
    }
  }, [activePath]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Render the appropriate content based on the active path
  const renderContent = () => {
    switch (activePath) {
      case '/':
        return <HomeLayout />;
      case '/chat':
        return <ChatLayout />;
      case '/library':
        return <LibraryView />;
      case '/images':
        return <ImageLayout />;
      case '/settings':
        return <div className="flex items-center justify-center h-full">Settings Content</div>;
      default:
        return <ChatLayout />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar navigation for desktop */}
        {!isMobileView && <Navigation />}
        
        {/* Mobile slide-out sidebar */}
        {isMobileView && (
          <>
            {/* Overlay */}
            {sidebarOpen && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-20"
                onClick={toggleSidebar}
              />
            )}
            
            {/* Slide-out sidebar */}
            <div 
              className={cn(
                "fixed inset-y-0 left-0 w-3/4 max-w-xs bg-white dark:bg-gray-900 z-30 transform transition-transform duration-300 ease-in-out",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              )}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center">
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2"
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
                  <h1 className="font-bold text-lg tracking-wide">ONE</h1>
                </div>
                <Button 
                  onClick={toggleSidebar}
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex flex-col h-full justify-between py-4">
                <div className="space-y-1 px-2">
                  {useNavigationStore.getState().items.filter(item => item.path !== '/settings').map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          useNavigationStore.getState().setActivePath(item.path);
                          toggleSidebar();
                        }}
                        className={cn(
                          "flex items-center w-full rounded-lg px-3 py-2 transition-colors",
                          activePath === item.path
                            ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-500"
                            : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-300"
                        )}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span className="ml-3 truncate">{item.name}</span>
                      </button>
                    );
                  })}
                </div>
                
                {/* Settings pinned to bottom */}
                <div className="px-2 mt-auto border-t border-gray-200 dark:border-gray-800 pt-4">
                  {useNavigationStore.getState().items.filter(item => item.path === '/settings').map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          useNavigationStore.getState().setActivePath(item.path);
                          toggleSidebar();
                        }}
                        className={cn(
                          "flex items-center w-full rounded-lg px-3 py-2 transition-colors",
                          activePath === item.path
                            ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-500"
                            : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-300"
                        )}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span className="ml-3 truncate">{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Main content area */}
        <main className="flex-1 overflow-hidden">
          {children || renderContent()}
        </main>
      </div>
      
      {/* Bottom navigation for mobile */}
      {isMobileView && <Navigation />}
      
      {/* Add padding at the bottom on mobile to account for the navigation bar */}
      {isMobileView && <div className="h-16" />}
    </div>
  );
};

export default ApplicationContainer;
