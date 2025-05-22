
import { useState, useRef, useEffect } from 'react';
import { Send, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const ChatUI = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am Prometheus, your AI assistant. How can I help you today?'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

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
    
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Thank you for your message. As Prometheus, I'm focused on helping you achieve growth. I've analyzed your request: "${input}" and would be happy to provide strategic guidance on this topic.`
      };
      
      setMessages(prev => [...prev, assistantMessage]);
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
    <div className="flex flex-col h-full overflow-hidden bg-white dark:bg-prometheus-navy">
      {/* Messages area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-6"
      >
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={cn(
              "animate-fade-in rounded-lg p-4",
              message.role === 'user' 
                ? 'bg-prometheus-ultraLightGray dark:bg-prometheus-lightNavy ml-8 md:ml-16' 
                : 'bg-white dark:bg-prometheus-navy border border-prometheus-mediumGray/20 dark:border-prometheus-lightNavy mr-8 md:mr-16'
            )}
          >
            <div className="flex items-start gap-4">
              <div className={cn(
                "w-10 h-10 rounded-full overflow-hidden flex-shrink-0",
                message.role === 'assistant' ? 'bg-prometheus-yellow' : 'bg-prometheus-lightBlue dark:bg-prometheus-turquoise'
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
                <div className="font-medium text-sm mb-1 text-prometheus-darkGray dark:text-prometheus-lightGray">
                  {message.role === 'user' ? 'You' : 'Prometheus'}
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {message.content}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="animate-fade-in rounded-lg p-4 bg-white dark:bg-prometheus-navy border border-prometheus-mediumGray/20 dark:border-prometheus-lightNavy mr-8 md:mr-16">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-prometheus-yellow">
                <img 
                  src="/logo.png" 
                  alt="Prometheus" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex items-center h-10">
                <Loader className="animate-spin h-5 w-5 mr-2 text-prometheus-yellow" />
                <span className="text-sm font-medium text-prometheus-darkGray dark:text-prometheus-lightGray">Prometheus is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={endOfMessagesRef} className="h-4" />
      </div>
      
      {/* Input area */}
      <div className="border-t border-prometheus-mediumGray/20 dark:border-prometheus-lightNavy p-4 bg-white dark:bg-prometheus-navy shadow-lg">
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
              className="w-full p-4 pr-14 resize-none bg-prometheus-ultraLightGray dark:bg-prometheus-lightNavy rounded-xl min-h-[60px] max-h-[200px] focus:outline-none focus:ring-2 focus:ring-prometheus-yellow border-none shadow-sm"
              style={{ height: '60px' }}
              rows={1}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute bottom-2 right-2 h-10 w-10 p-0 rounded-full bg-prometheus-yellow hover:bg-prometheus-orange text-prometheus-navy transition-colors duration-200"
            >
              <Send className="h-5 w-5" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
          <div className="text-xs text-center mt-3 text-prometheus-darkGray/60 dark:text-prometheus-mediumGray">
            Prometheus may produce inaccurate information about people, places, or facts.
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatUI;
