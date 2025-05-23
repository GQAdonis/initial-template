import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

// Define the types for our chat messages
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Define the type for a chat
interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

// Define the store state
interface ChatState {
  chats: Chat[];
  activeChat: string | null;
  createChat: (title?: string) => string;
  setActiveChat: (id: string) => void;
  addMessage: (chatId: string, message: { role: 'user' | 'assistant'; content: string }) => void;
  updateChatTitle: (chatId: string, title: string) => void;
  deleteChat: (chatId: string) => void;
}

// Create the store
export const useChatStore = create<ChatState>((set) => ({
  // Initial chats
  chats: [],
  // Default active chat
  activeChat: null,
  // Create a new chat
  createChat: (title = 'New Chat') => {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    set((state) => ({
      chats: [
        {
          id,
          title,
          messages: [],
          createdAt: now,
          updatedAt: now,
        },
        ...state.chats,
      ],
      activeChat: id,
    }));
    
    return id;
  },
  // Set active chat
  setActiveChat: (id) => set({ activeChat: id }),
  // Add a message to a chat
  addMessage: (chatId, message) => {
    set((state) => {
      const now = new Date().toISOString();
      
      return {
        chats: state.chats.map((chat) => {
          if (chat.id === chatId) {
            return {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  id: uuidv4(),
                  ...message,
                  timestamp: now,
                },
              ],
              updatedAt: now,
            };
          }
          return chat;
        }),
      };
    });
  },
  // Update chat title
  updateChatTitle: (chatId, title) => {
    set((state) => ({
      chats: state.chats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            title,
            updatedAt: new Date().toISOString(),
          };
        }
        return chat;
      }),
    }));
  },
  // Delete a chat
  deleteChat: (chatId) => {
    set((state) => {
      const filteredChats = state.chats.filter((chat) => chat.id !== chatId);
      
      return {
        chats: filteredChats,
        activeChat: state.activeChat === chatId
          ? filteredChats.length > 0 ? filteredChats[0].id : null
          : state.activeChat,
      };
    });
  },
}));
