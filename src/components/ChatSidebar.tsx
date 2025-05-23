import { useChatStore } from '@/stores/chat-store';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ChatSidebarProps {
  className?: string;
}

/**
 * ChatSidebar component that displays recent chats and provides a "New Chat" button.
 * This component can be placed in different locations based on the current layout (desktop/mobile).
 */
const ChatSidebar = ({ className = '' }: ChatSidebarProps) => {
  const { chats, activeChat, createChat, setActiveChat } = useChatStore();
  
  // Handle creating a new chat
  const handleNewChat = () => {
    const newChatId = createChat("New Conversation");
    setActiveChat(newChatId);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="p-4">
        <Button 
          onClick={handleNewChat}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium flex items-center justify-center gap-2 border-none shadow-sm py-5"
        >
          <Plus size={18} />
          <span>New Chat</span>
        </Button>
      </div>
      
      <div className="px-4 py-2">
        <h2 className="text-sm font-semibold mb-3 text-gray-500">Recent chats</h2>
        <ul className="flex w-full min-w-0 flex-col gap-1">
          {chats.map((chat) => (
            <li key={chat.id} className="group relative">
              <button
                onClick={() => setActiveChat(chat.id)}
                className={`flex w-full items-center gap-2 overflow-hidden rounded-md text-left outline-none transition-all py-2
                  ${activeChat === chat.id 
                    ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground px-2 mr-3' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 px-2'}`}
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <span className="text-xs">💬</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{chat.title}</div>
                  <div className="text-xs text-gray-500">
                    {formatDate(chat.createdAt)}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatSidebar;
