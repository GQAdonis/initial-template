import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import MobileSidebar from '@/components/MobileSidebar';
import { useNavigationStore } from '@/stores/navigation-store';
import LibraryView from '@/components/LibraryView';
import ImageGenerationView from '@/components/ImageGenerationView';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { activePath, setMobileView } = useNavigationStore();
  const isMobile = useIsMobile();
  
  // Update mobile view state when screen size changes
  useEffect(() => {
    setMobileView(isMobile);
  }, [isMobile, setMobileView]);

  // Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  // Render content based on active path
  const renderContent = () => {
    switch (activePath) {
      case '/':
        return <div className="p-4">Home Content</div>;
      case '/chat':
        return <div className="p-4">Chat Content</div>;
      case '/library':
        return <LibraryView />;
      case '/images':
        return <ImageGenerationView />;
      case '/settings':
        return <div className="p-4">Settings Content</div>;
      default:
        return <div className="p-4">Page not found</div>;
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Header toggleSidebar={toggleMobileSidebar} />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Navigation */}
        {!isMobile && <Navigation />}
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
      
      {/* Mobile Navigation */}
      {isMobile && (
        <div className="h-16">
          <Navigation />
        </div>
      )}
      
      {/* Mobile Sidebar */}
      {mobileSidebarOpen && (
        <MobileSidebar 
          isOpen={mobileSidebarOpen} 
          onClose={() => setMobileSidebarOpen(false)} 
        />
      )}
    </div>
  );
};

export default Index;
