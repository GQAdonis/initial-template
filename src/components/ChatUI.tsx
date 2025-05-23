import { useEffect } from 'react';
import { useChatStore } from '@/stores/chat-store';
import { useChat } from 'ai/react';
import { useNavigationStore } from '@/stores/navigation-store';
import { Button } from '@/components/ui/button';
import { Send, PlusCircle, PanelLeft } from 'lucide-react';

/**
 * ChatUI component that follows the context-aware UI architecture.
 * This component implements the Chat context in the Multi-Modal Workspace Hub Pattern.
 */
const ChatUI = () => {
  const { chats, activeChat, createChat, setActiveChat } = useChatStore();
  const { isMobileView, chatSidebarExpanded, toggleChatSidebar } = useNavigationStore();
  
  // Get the active chat or create a new one if none exists
  useEffect(() => {
    if (!activeChat && chats.length === 0) {
      createChat("New Conversation");
    } else if (!activeChat && chats.length > 0) {
      setActiveChat(chats[0].id);
    }
  }, [activeChat, chats, createChat, setActiveChat]);
  
  // Get the active chat title
  const getActiveChatTitle = () => {
    if (!activeChat) return "New Conversation";
    const chat = chats.find(c => c.id === activeChat);
    return chat ? chat.title : "New Conversation";
  };

  // Use the AI SDK's useChat hook to connect to the OpenAI-compatible API
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: import.meta.env.VITE_COPILOT_API_URL || '/api/chat',
    id: activeChat || 'default-chat',
    body: {
      model: 'gpt-4-turbo',
      temperature: 0.7,
    },
  });

  // Handle creating a new chat
  const handleNewChat = () => {
    const newChatId = createChat("New Conversation");
    setActiveChat(newChatId);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header - Following the context-aware UI architecture */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          {!isMobileView && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-2 p-1"
              onClick={toggleChatSidebar}
            >
              <PanelLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-xl font-bold">{getActiveChatTitle()}</h1>
        </div>
        {(!isMobileView && !chatSidebarExpanded) && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNewChat}
            className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium border-none"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Chat</span>
          </Button>
        )}
      </div>
      
      {/* Messages area - Main content for the Chat context */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <h3 className="text-lg font-medium mb-2">Welcome to ONE chat</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start a conversation by typing a message below.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className={`py-4 ${message.role === 'user' ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'} rounded-lg mb-4 p-4`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ${message.role === 'assistant' ? 'bg-yellow-400' : 'bg-blue-400 dark:bg-teal-500'}`}>
                  {message.role === 'user' ? (
                    <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">U</div>
                  ) : (
                    <img 
                      src="/logo.png" 
                      alt="Prometheus" 
                      className="w-full h-full object-cover" 
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm mb-1 text-gray-700 dark:text-gray-300">
                    {message.role === 'user' ? 'You' : 'ONE'}
                  </div>
                  <div className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="py-4 bg-white dark:bg-gray-900 rounded-lg mb-4 p-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-yellow-400">
                <img 
                  src="/logo.png" 
                  alt="Prometheus" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex items-center h-10">
                <div className="animate-pulse h-5 w-5 mr-2 rounded-full bg-yellow-400"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Prometheus is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Input area - Consistent with the UI architecture */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900 shadow-lg">
        <form onSubmit={handleSubmit} className="flex flex-col max-w-3xl mx-auto">
          <div className="relative">
            <textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Message ONE..."
              className="w-full p-4 pr-14 resize-none bg-gray-50 dark:bg-gray-800 rounded-xl min-h-[60px] max-h-[200px] focus:outline-none focus:ring-2 focus:ring-yellow-400 border-none shadow-sm"
              rows={1}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute top-1/2 -translate-y-1/2 right-2 h-10 w-10 p-0 rounded-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 transition-colors duration-200"
              size="icon"
            >
              <Send className="h-5 w-5" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
          <div className="text-xs text-center mt-3 text-gray-500 dark:text-gray-400">
            Prometheus may produce inaccurate information about people, places, or facts.
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatUI;
