import { useState } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import { useNavigationStore } from '@/stores/navigation-store';
import HomeLayout from '@/components/HomeLayout';
import MobileSidebar from '@/components/MobileSidebar';

// Placeholder components for other routes
const ChatLayout = () => <div className="p-6">Chat Interface</div>;
const LibraryLayout = () => <div className="p-6">Library Interface</div>;
const ImagesLayout = () => <div className="p-6">Images Interface</div>;
const SettingsLayout = () => <div className="p-6">Settings Interface</div>;

const AppLayout = () => {
  const { activePath, isMobileView } = useNavigationStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Render the appropriate content based on the active path
  const renderContent = () => {
    switch (activePath) {
      case '/':
        return <HomeLayout />;
      case '/chat':
        return <ChatLayout />;
      case '/library':
        return <LibraryLayout />;
      case '/images':
        return <ImagesLayout />;
      case '/settings':
        return <SettingsLayout />;
      default:
        return <HomeLayout />;
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Header toggleSidebar={() => setMobileSidebarOpen(true)} />
      
      <div className="flex-1 flex overflow-hidden">
        {!isMobileView && <Navigation />}
        
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
      
      {/* Mobile sidebar */}
      {isMobileView && (
        <MobileSidebar 
          isOpen={mobileSidebarOpen} 
          onClose={() => setMobileSidebarOpen(false)} 
        />
      )}
    </div>
  );
};

export default AppLayout;
