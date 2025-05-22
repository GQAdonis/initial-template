
import { useState } from 'react';
import { Plus, MessageSquare, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  onClose: () => void;
}

interface ChatHistory {
  id: string;
  title: string;
  date: Date;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  // Sample chat history
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

  const startNewChat = () => {
    console.log('Starting new chat');
    // Implementation for starting a new chat would go here
    onClose(); // Close sidebar on mobile
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-prometheus-navy text-prometheus-darkGray dark:text-prometheus-lightGray">
      <div className="p-4 flex justify-between items-center border-b border-prometheus-mediumGray/20 dark:border-prometheus-lightNavy">
        <div className="flex items-center">
          <img 
            src="/logo.png" 
            alt="Prometheus Logo" 
            className="h-8 w-auto mr-2" 
          />
          <h1 className="font-heading text-lg font-semibold text-prometheus-navy dark:text-white tracking-wide">PROMETHEUS</h1>
        </div>
        <button 
          onClick={onClose} 
          className="md:hidden p-2 hover:bg-prometheus-ultraLightGray dark:hover:bg-prometheus-lightNavy rounded-full transition-colors duration-200"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-4">
        <Button 
          onClick={startNewChat}
          variant="outline" 
          className="w-full bg-prometheus-yellow hover:bg-prometheus-orange text-prometheus-navy font-medium transition-colors duration-200 flex items-center justify-center gap-2 border-none shadow-sm py-5"
        >
          <Plus size={18} />
          <span>New Chat</span>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-2">
          <h2 className="text-sm font-semibold mb-3 text-prometheus-darkGray/70 dark:text-prometheus-mediumGray">Recent chats</h2>
          <ul className="space-y-2">
            {chatHistory.map((chat) => (
              <li key={chat.id}>
                <button
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-prometheus-ultraLightGray dark:hover:bg-prometheus-lightNavy transition-colors duration-200 group flex items-start"
                  onClick={() => {
                    console.log(`Selected chat: ${chat.id}`);
                    onClose(); // Close sidebar on mobile
                  }}
                >
                  <MessageSquare size={18} className="mr-3 mt-0.5 flex-shrink-0 text-prometheus-darkGray/70 dark:text-prometheus-mediumGray" />
                  <div className="overflow-hidden">
                    <div className="truncate font-medium">{chat.title}</div>
                    <div className="text-xs mt-1 text-prometheus-darkGray/50 dark:text-prometheus-mediumGray/70">
                      {chat.date.toLocaleDateString()}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-auto border-t border-prometheus-mediumGray/20 dark:border-prometheus-lightNavy p-4">
        <button className="flex items-center gap-2 px-4 py-3 w-full rounded-lg hover:bg-prometheus-ultraLightGray dark:hover:bg-prometheus-lightNavy transition-colors duration-200">
          <Settings size={18} className="text-prometheus-darkGray/70 dark:text-prometheus-mediumGray" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;