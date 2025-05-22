import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';
import ChatUI from './ChatUI';
import '@/styles/app-layout.css';

const ChatLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Listen for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMobile && sidebarOpen) {
        const target = e.target as HTMLElement;
        if (!target.closest('.sidebar-container') && !target.closest('.sidebar-toggle')) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobile, sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="chat-layout-container">
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`sidebar-container fixed md:relative z-50 h-full w-[280px] md:w-[280px] transition-all duration-300 ${
          isMobile ? (sidebarOpen ? 'left-0' : '-left-[280px]') : 'left-0'
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="main-content flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile header with menu toggle */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <button 
            className="sidebar-toggle p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
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

        {/* Chat UI */}
        <ChatUI />
      </div>
    </div>
  );
};

export default ChatLayout;