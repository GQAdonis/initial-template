import { useState } from 'react';
import { X, Plus, MessageSquare, BookOpen, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigationStore } from '@/stores/navigation-store';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Home list item type
interface HomeItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

// Chat history item type
interface ChatHistory {
  id: string;
  title: string;
  date: Date;
}

// Library item type
interface LibraryItem {
  id: string;
  title: string;
  category: string;
  date: Date;
}

// Image history item type
interface ImageItem {
  id: string;
  title: string;
  thumbnail: string;
  date: Date;
}

const MobileSidebar = ({ isOpen, onClose }: MobileSidebarProps) => {
  const { activePath } = useNavigationStore();
  
  // Sample data for each context
  const [homeItems] = useState<HomeItem[]>([
    {
      id: '1',
      icon: <MessageSquare className="h-5 w-5 text-yellow-500" />,
      title: 'Strategic Conversations',
      subtitle: 'Engage in detailed discussions about your business goals'
    },
    {
      id: '2',
      icon: <BookOpen className="h-5 w-5 text-yellow-500" />,
      title: 'Knowledge Library',
      subtitle: 'Access a comprehensive collection of business insights'
    },
    {
      id: '3',
      icon: <Image className="h-5 w-5 text-yellow-500" />,
      title: 'Visual Analytics',
      subtitle: 'Generate and analyze visual representations of your data'
    }
  ]);

  const [chatHistory] = useState<ChatHistory[]>([
    {
      id: '1',
      title: 'Brand strategy analysis',
      date: new Date(2025, 4, 20)
    },
    {
      id: '2',
      title: 'Market research summary',
      date: new Date(2025, 4, 21)
    },
    {
      id: '3',
      title: 'Product launch ideas',
      date: new Date(2025, 4, 21)
    }
  ]);

  const [libraryItems] = useState<LibraryItem[]>([
    {
      id: '1',
      title: 'Market Analysis Framework',
      category: 'Business Strategy',
      date: new Date(2025, 3, 15)
    },
    {
      id: '2',
      title: 'Competitive Landscape Report',
      category: 'Market Research',
      date: new Date(2025, 4, 2)
    },
    {
      id: '3',
      title: 'Growth Hacking Techniques',
      category: 'Marketing',
      date: new Date(2025, 4, 10)
    }
  ]);

  const [imageItems] = useState<ImageItem[]>([
    {
      id: '1',
      title: 'Q2 Sales Performance',
      thumbnail: 'https://images.pexels.com/photos/7947541/pexels-photo-7947541.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      date: new Date(2025, 3, 25)
    },
    {
      id: '2',
      title: 'Customer Acquisition Funnel',
      thumbnail: 'https://images.pexels.com/photos/6476260/pexels-photo-6476260.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      date: new Date(2025, 4, 5)
    },
    {
      id: '3',
      title: 'Product Roadmap Visualization',
      thumbnail: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      date: new Date(2025, 4, 15)
    }
  ]);

  // Action button based on context
  const getActionButton = () => {
    let buttonText = '';
    let icon = null;
    
    switch (activePath) {
      case '/':
        buttonText = 'New Item';
        icon = <Plus size={18} />;
        break;
      case '/chat':
        buttonText = 'New Chat';
        icon = <Plus size={18} />;
        break;
      case '/library':
        buttonText = 'Browse Library';
        icon = <BookOpen size={18} />;
        break;
      case '/images':
        buttonText = 'Create Image';
        icon = <Plus size={18} />;
        break;
      default:
        return null;
    }
    
    return (
      <Button 
        variant="outline" 
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium flex items-center justify-center gap-2 border-none shadow-sm py-5"
        onClick={() => {
          console.log(`Action for ${activePath}`);
          onClose();
        }}
      >
        {icon}
        <span>{buttonText}</span>
      </Button>
    );
  };

  // Render content based on active path
  const renderContextContent = () => {
    switch (activePath) {
      case '/':
        return (
          <div className="px-4 py-2">
            <h2 className="text-sm font-semibold mb-3 text-gray-500">Featured items</h2>
            <ul className="space-y-3">
              {homeItems.map((item) => (
                <li key={item.id}>
                  <button
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                    onClick={() => {
                      console.log(`Selected home item: ${item.id}`);
                      onClose();
                    }}
                  >
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">{item.icon}</div>
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-gray-500 mt-1">{item.subtitle}</div>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      
      case '/chat':
        return (
          <div className="px-4 py-2">
            <h2 className="text-sm font-semibold mb-3 text-gray-500">Recent conversations</h2>
            <ul className="space-y-2">
              {chatHistory.map((chat) => (
                <li key={chat.id}>
                  <button
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 group flex items-start"
                    onClick={() => {
                      console.log(`Selected chat: ${chat.id}`);
                      onClose();
                    }}
                  >
                    <MessageSquare size={18} className="mr-3 mt-0.5 flex-shrink-0 text-gray-500" />
                    <div className="overflow-hidden">
                      <div className="truncate font-medium">{chat.title}</div>
                      <div className="text-xs mt-1 text-gray-500">
                        {chat.date.toLocaleDateString()}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      
      case '/library':
        return (
          <div className="px-4 py-2">
            <h2 className="text-sm font-semibold mb-3 text-gray-500">Knowledge base</h2>
            <ul className="space-y-2">
              {libraryItems.map((item) => (
                <li key={item.id}>
                  <button
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 group flex items-start"
                    onClick={() => {
                      console.log(`Selected library item: ${item.id}`);
                      onClose();
                    }}
                  >
                    <BookOpen size={18} className="mr-3 mt-0.5 flex-shrink-0 text-gray-500" />
                    <div className="overflow-hidden">
                      <div className="truncate font-medium">{item.title}</div>
                      <div className="flex items-center mt-1">
                        <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
                          {item.category}
                        </span>
                        <span className="text-xs ml-2 text-gray-500">
                          {item.date.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      
      case '/images':
        return (
          <div className="px-4 py-2">
            <h2 className="text-sm font-semibold mb-3 text-gray-500">Image history</h2>
            <ul className="space-y-3">
              {imageItems.map((item) => (
                <li key={item.id}>
                  <button
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                    onClick={() => {
                      console.log(`Selected image: ${item.id}`);
                      onClose();
                    }}
                  >
                    <div className="flex items-start">
                      <div className="w-16 h-16 rounded overflow-hidden mr-3 flex-shrink-0">
                        <img 
                          src={item.thumbnail} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs mt-1 text-gray-500">
                          {item.date.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      
      default:
        return (
          <div className="px-4 py-2">
            <p className="text-gray-500">No content available</p>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Sidebar */}
      <div className="relative w-full max-w-xs bg-white dark:bg-gray-900 h-full shadow-xl flex flex-col overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
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
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4">
          {getActionButton()}
        </div>

        <div className="flex-1 overflow-y-auto">
          {renderContextContent()}
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
