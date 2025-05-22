import { useState, useEffect, ReactNode } from 'react';
import { useNavigationStore } from '@/stores/navigation-store';
import ChatLayout from './ChatLayout';
import LibraryView from './LibraryView';
import ImageGenerationView from './ImageGenerationView';
import SettingsView from './SettingsView';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { 
  Sidebar, 
  SidebarProvider, 
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

interface ApplicationContainerProps {
  children?: ReactNode;
}

const ApplicationContainer = ({ children }: ApplicationContainerProps) => {
  const {
    items,
    activeItem,
    setActiveItem,
    sidebarExpanded,
    setSidebarExpanded,
    setMobileView
  } = useNavigationStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768;
      setMobileView(isMobile);
      
      // Auto-collapse sidebar on smaller screens
      if (window.innerWidth < 1024 && sidebarExpanded) {
        setSidebarExpanded(false);
      }
    };

    // Initial check
    checkMobile();

    // Listen for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [setSidebarExpanded, setMobileView, sidebarExpanded]);

  // Render the appropriate application based on the active item
  const renderApplication = () => {
    switch (activeItem) {
      case 'chat':
        return <ChatLayout />;
      case 'library':
        return <LibraryView />;
      case 'images':
        return <ImageGenerationView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <Outlet />;
    }
  };

  // Mobile header with hamburger menu
  const MobileHeader = () => (
    <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex items-center">
        <img 
          src="/logo.png" 
          alt="Prometheus Logo" 
          className="h-8 w-auto"
        />
        <span className="ml-2 font-bold text-lg tracking-wide">PROMETHEUS</span>
      </div>
      <div className="w-8"></div> {/* Spacer for centering */}
    </div>
  );

  // Mobile bottom navigation
  const MobileBottomNav = () => {
    // If we have more than 4 items, we'll show the first 4 and put the rest in a "More" menu
    const visibleItems = items.slice(0, 4);
    const moreItems = items.length > 4 ? items.slice(4) : [];
    const [moreMenuOpen, setMoreMenuOpen] = useState(false);

    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background z-50">
        <div className="flex justify-around items-center h-14">
          {visibleItems.map((item) => (
            <Button 
              key={item.id}
              variant="ghost" 
              className={`flex flex-col items-center justify-center h-full w-full rounded-none border-none shadow-none ${
                activeItem === item.id ? 'text-primary' : 'text-muted-foreground'
              }`}
              onClick={() => setActiveItem(item.id)}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.name}</span>
            </Button>
          ))}
          
          {moreItems.length > 0 && (
            <div className="relative">
              <Button 
                variant="ghost" 
                className={`flex flex-col items-center justify-center h-full w-full rounded-none border-none shadow-none ${
                  moreItems.some(item => activeItem === item.id) ? 'text-primary' : 'text-muted-foreground'
                }`}
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="5" cy="12" r="1" />
                </svg>
                <span className="text-xs mt-1">More</span>
              </Button>
              
              {moreMenuOpen && (
                <div className="absolute bottom-full mb-2 right-0 bg-popover rounded-md shadow-md overflow-hidden min-w-[150px]">
                  {moreItems.map((item) => (
                    <Button 
                      key={item.id}
                      variant="ghost" 
                      className={`flex items-center justify-start w-full px-4 py-2 text-sm ${
                        activeItem === item.id ? 'bg-primary/10 text-primary' : 'text-popover-foreground'
                      }`}
                      onClick={() => {
                        setActiveItem(item.id);
                        setMoreMenuOpen(false);
                      }}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      <span>{item.name}</span>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Desktop Navigation Sidebar */}
      <div className="hidden md:flex">
        <SidebarProvider defaultOpen={sidebarExpanded} open={sidebarExpanded} onOpenChange={setSidebarExpanded}>
          <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
              <div className="flex items-center justify-between h-16 px-2">
                <img 
                  src="/logo.png" 
                  alt="Prometheus Logo" 
                  className="h-8 w-auto" 
                />
                <SidebarTrigger className="ml-auto" />
              </div>
            </SidebarHeader>
            <SidebarContent className="px-2">
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      isActive={activeItem === item.id}
                      tooltip={item.name}
                      onClick={() => setActiveItem(item.id)}
                      className={`border-none shadow-none ${activeItem === item.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted/50'} rounded-md transition-colors`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      </div>

      {/* Mobile Sidebar (hidden by default, shown when hamburger menu is clicked) */}
      <div className="md:hidden">
        <SidebarProvider defaultOpen={false} open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <Sidebar variant="floating" side="left">
            <SidebarHeader>
              <div className="flex items-center p-4">
                <img 
                  src="/logo.png" 
                  alt="Prometheus Logo" 
                  className="h-8 w-auto mr-2" 
                />
                <h1 className="font-bold text-lg tracking-wide">PROMETHEUS</h1>
              </div>
            </SidebarHeader>
            <SidebarContent className="px-2">
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      isActive={activeItem === item.id}
                      onClick={() => {
                        setActiveItem(item.id);
                        // Close sidebar after selection on mobile
                        setIsMenuOpen(false);
                      }}
                      className={`border-none shadow-none ${activeItem === item.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted/50'} rounded-md transition-colors`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      </div>

      {/* Application Content */}
      <div className="flex-1 h-full overflow-hidden flex flex-col">
        {/* Mobile Header */}
        <MobileHeader />
        
        {/* Main Content */}
        <div className="flex-1 overflow-hidden md:pb-0 pb-16">
          {children || renderApplication()}
        </div>
        
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </div>
  );
};

export default ApplicationContainer;
