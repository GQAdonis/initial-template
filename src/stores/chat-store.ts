import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChatState {
  chats: Chat[];
  activeChat: string | null;
  setActiveChat: (chatId: string) => void;
  createChat: (title?: string) => string;
  addMessage: (chatId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  deleteChat: (chatId: string) => void;
  updateChatTitle: (chatId: string, title: string) => void;
}

// Create mock data for initial state
const createMockChats = (): Chat[] => {
  const mockChats: Chat[] = [
    {
      id: '1',
      title: 'Brand strategy analysis',
      messages: [
        {
          id: '1-1',
          role: 'user',
          content: 'Can you help me analyze our brand strategy?',
          timestamp: new Date(2025, 4, 20, 10, 30)
        },
        {
          id: '1-2',
          role: 'assistant',
          content: 'I\'d be happy to help analyze your brand strategy. Could you share some details about your current positioning and target audience?',
          timestamp: new Date(2025, 4, 20, 10, 31)
        }
      ],
      createdAt: new Date(2025, 4, 20, 10, 30),
      updatedAt: new Date(2025, 4, 20, 10, 31)
    },
    {
      id: '2',
      title: 'Market research summary',
      messages: [
        {
          id: '2-1',
          role: 'user',
          content: 'I need a summary of our recent market research findings.',
          timestamp: new Date(2025, 4, 21, 14, 15)
        },
        {
          id: '2-2',
          role: 'assistant',
          content: 'I\'ll help you summarize the market research findings. What specific aspects are you most interested in?',
          timestamp: new Date(2025, 4, 21, 14, 16)
        }
      ],
      createdAt: new Date(2025, 4, 21, 14, 15),
      updatedAt: new Date(2025, 4, 21, 14, 16)
    },
    {
      id: '3',
      title: 'Product launch ideas',
      messages: [
        {
          id: '3-1',
          role: 'user',
          content: 'Let\'s brainstorm some product launch ideas.',
          timestamp: new Date(2025, 4, 21, 16, 45)
        },
        {
          id: '3-2',
          role: 'assistant',
          content: 'Great! I\'d be happy to help brainstorm product launch ideas. What type of product are we launching and who is the target audience?',
          timestamp: new Date(2025, 4, 21, 16, 46)
        }
      ],
      createdAt: new Date(2025, 4, 21, 16, 45),
      updatedAt: new Date(2025, 4, 21, 16, 46)
    }
  ];
  
  return mockChats;
};

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      chats: createMockChats(),
      activeChat: null,
      
      setActiveChat: (chatId) => set({ activeChat: chatId }),
      
      createChat: (title) => {
        const id = uuidv4();
        const now = new Date();
        const newChat: Chat = {
          id,
          title: title || `New Chat ${format(now, 'MMM d, yyyy')}`,
          messages: [],
          createdAt: now,
          updatedAt: now
        };
        
        set((state) => ({
          chats: [newChat, ...state.chats],
          activeChat: id
        }));
        
        return id;
      },
      
      addMessage: (chatId, message) => {
        const now = new Date();
        const newMessage: Message = {
          id: uuidv4(),
          ...message,
          timestamp: now
        };
        
        set((state) => {
          const updatedChats = state.chats.map(chat => {
            if (chat.id === chatId) {
              // Update chat with new message
              return {
                ...chat,
                messages: [...chat.messages, newMessage],
                updatedAt: now,
                // Update title if it's the first user message and no custom title exists
                title: chat.messages.length === 0 && message.role === 'user' 
                  ? message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '')
                  : chat.title
              };
            }
            return chat;
          });
          
          return { chats: updatedChats };
        });
      },
      
      deleteChat: (chatId) => {
        set((state) => {
          const filteredChats = state.chats.filter(chat => chat.id !== chatId);
          const newActiveChat = state.activeChat === chatId 
            ? (filteredChats.length > 0 ? filteredChats[0].id : null)
            : state.activeChat;
            
          return {
            chats: filteredChats,
            activeChat: newActiveChat
          };
        });
      },
      
      updateChatTitle: (chatId, title) => {
        set((state) => ({
          chats: state.chats.map(chat => 
            chat.id === chatId ? { ...chat, title } : chat
          )
        }));
      }
    }),
    {
      name: 'prometheus-chat-storage',
      partialize: (state) => ({ chats: state.chats, activeChat: state.activeChat }),
    }
  )
);
