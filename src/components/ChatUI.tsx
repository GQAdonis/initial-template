import { useState, useRef, useEffect } from 'react';
import { Send, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/stores/chat-store';

const ChatUI = () => {
  const { chats, activeChat, addMessage, createChat } = useChatStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Get the active chat or create a new one if none exists
  useEffect(() => {
    if (!activeChat && chats.length === 0) {
      createChat("New Conversation");
    } else if (!activeChat && chats.length > 0) {
      useChatStore.getState().setActiveChat(chats[0].id);
    }
  }, [activeChat, chats, createChat]);

  // Get messages for the active chat
  const messages = activeChat 
    ? chats.find(chat => chat.id === activeChat)?.messages || []
    : [];

  useEffect(() => {
    // Scroll to bottom when messages change
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // Focus input after sending a message
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading || !activeChat) return;
    
    // Add user message
    addMessage(activeChat, {
      role: 'user',
      content: input
    });
    
    setInput('');
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      addMessage(activeChat, {
        role: 'assistant',
        content: `Thank you for your message. As Prometheus, I'm focused on helping you achieve growth. I've analyzed your request: "${input}" and would be happy to provide strategic guidance on this topic.`
      });
      
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const autoResizeTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white dark:bg-gray-900">
      {/* Messages area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto"
      >
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={cn(
              "py-6 px-4 md:px-6",
              message.role === 'user' 
                ? 'bg-gray-50 dark:bg-gray-800' 
                : 'bg-white dark:bg-gray-900'
            )}
          >
            <div className="max-w-3xl mx-auto flex items-start gap-4">
              <div className={cn(
                "w-10 h-10 rounded-full overflow-hidden flex-shrink-0",
                message.role === 'assistant' ? 'bg-yellow-400' : 'bg-blue-400 dark:bg-teal-500'
              )}>
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
                  {message.role === 'user' ? 'You' : 'Prometheus'}
                </div>
                <div className="text-gray-900 dark:text-gray-100">
                  {message.content}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="py-6 px-4 md:px-6 bg-white dark:bg-gray-900">
            <div className="max-w-3xl mx-auto flex items-start gap-4">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-yellow-400">
                <img 
                  src="/logo.png" 
                  alt="Prometheus" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex items-center h-10">
                <Loader className="animate-spin h-5 w-5 mr-2 text-yellow-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Prometheus is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={endOfMessagesRef} className="h-4" />
      </div>
      
      {/* Input area */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900 shadow-lg">
        <form onSubmit={handleSubmit} className="flex flex-col max-w-3xl mx-auto">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                autoResizeTextarea(e);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Message Prometheus..."
              className="w-full p-4 pr-14 resize-none bg-gray-50 dark:bg-gray-800 rounded-xl min-h-[60px] max-h-[200px] focus:outline-none focus:ring-2 focus:ring-yellow-400 border-none shadow-sm"
              style={{ height: '60px' }}
              rows={1}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading || !activeChat}
              className="absolute bottom-2 right-2 h-10 w-10 p-0 rounded-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 transition-colors duration-200"
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