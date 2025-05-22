import { useState, useEffect } from 'react';
import { MessageSquare, Plus, Settings } from 'lucide-react';
import { 
  Sidebar, 
  SidebarProvider, 
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import ChatUI from './ChatUI';
import { useChatStore } from '@/stores/chat-store';
import { useNavigationStore } from '@/stores/navigation-store';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const ChatLayout = () => {
  const { chats, activeChat, setActiveChat, createChat } = useChatStore();
  const { items, activeItem } = useNavigationStore();
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

  const handleNewChat = () => {
    createChat();
  };

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full overflow-hidden">
        {/* Main Navigation Sidebar */}
        <Sidebar collapsible="icon" variant="inset">
          <SidebarHeader>
            <div className="flex items-center justify-center h-16">
              <img 
                src="/logo.png" 
                alt="Prometheus Logo" 
                className="h-8 w-auto" 
              />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    isActive={activeItem === item.id}
                    tooltip={item.name}
                    onClick={() => useNavigationStore.getState().setActiveItem(item.id)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        {/* Chat Sidebar */}
        <div className="flex flex-1 h-full overflow-hidden">
          <SidebarProvider defaultOpen={!isMobile}>
            <Sidebar variant="floating" side="left">
              <SidebarHeader>
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <img 
                      src="/logo.png" 
                      alt="Prometheus Logo" 
                      className="h-8 w-auto mr-2" 
                    />
                    <h1 className="font-bold text-lg tracking-wide">PROMETHEUS</h1>
                  </div>
                </div>
              </SidebarHeader>
              <SidebarContent>
                <div className="p-4">
                  <Button 
                    onClick={handleNewChat}
                    variant="outline" 
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium flex items-center justify-center gap-2 border-none shadow-sm py-5"
                  >
                    <Plus size={18} />
                    <span>New Chat</span>
                  </Button>
                </div>
                <div className="px-4 py-2">
                  <h2 className="text-sm font-semibold mb-3 text-gray-500">Recent chats</h2>
                  <SidebarMenu>
                    {chats.map((chat) => (
                      <SidebarMenuItem key={chat.id}>
                        <SidebarMenuButton
                          isActive={activeChat === chat.id}
                          onClick={() => setActiveChat(chat.id)}
                        >
                          <MessageSquare size={18} className="text-gray-500" />
                          <div className="flex flex-col items-start">
                            <span className="truncate">{chat.title}</span>
                            <span className="text-xs text-gray-500">
                              {format(new Date(chat.updatedAt), 'MM/dd/yyyy')}
                            </span>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </div>
              </SidebarContent>
              <SidebarFooter>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Settings size={18} className="text-gray-500" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
            </Sidebar>

            {/* Main content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Mobile header */}
              <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <SidebarTrigger />
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
          </SidebarProvider>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ChatLayout;
