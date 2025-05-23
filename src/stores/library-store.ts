import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

// Define item types
export type FileType = 'document' | 'image' | 'video' | 'audio' | 'other';
export type FileFormat = 'pdf' | 'docx' | 'txt' | 'jpg' | 'png' | 'mp4' | 'mp3';

// Define item interface
export interface LibraryItem {
  id: string;
  name: string;
  description: string;
  fileType: FileType;
  fileFormat: FileFormat;
  fileSize: number; // in bytes
  uploadDate: string;
  lastModified: string;
  collectionId: string;
}

// Define collection interface
export interface Collection {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  items: LibraryItem[];
}

// Define store state interface
interface LibraryState {
  collections: Collection[];
  activeCollection: string | null;
  
  // Actions
  setActiveCollection: (id: string | null) => void;
  createCollection: (name: string, description: string) => void;
  deleteCollection: (id: string) => void;
  addItem: (collectionId: string, item: Omit<LibraryItem, 'id' | 'collectionId'>) => void;
  removeItem: (itemId: string) => void;
  searchItems: (query: string) => LibraryItem[];
}

// Create the store
export const useLibraryStore = create<LibraryState>((set, get) => ({
  // Initial state with sample data
  collections: [
    {
      id: '1',
      name: 'Work Documents',
      description: 'Important documents for work projects',
      createdAt: new Date('2023-01-15').toISOString(),
      updatedAt: new Date('2023-06-22').toISOString(),
      items: [
        {
          id: '101',
          name: 'Project Proposal',
          description: 'Proposal for the new client project',
          fileType: 'document',
          fileFormat: 'pdf',
          fileSize: 2500000, // 2.5 MB
          uploadDate: new Date('2023-01-15').toISOString(),
          lastModified: new Date('2023-01-15').toISOString(),
          collectionId: '1'
        },
        {
          id: '102',
          name: 'Meeting Notes',
          description: 'Notes from the weekly team meeting',
          fileType: 'document',
          fileFormat: 'docx',
          fileSize: 350000, // 350 KB
          uploadDate: new Date('2023-02-10').toISOString(),
          lastModified: new Date('2023-02-10').toISOString(),
          collectionId: '1'
        }
      ]
    },
    {
      id: '2',
      name: 'Research Materials',
      description: 'Research papers and reference materials',
      createdAt: new Date('2023-03-05').toISOString(),
      updatedAt: new Date('2023-05-18').toISOString(),
      items: [
        {
          id: '201',
          name: 'AI Research Paper',
          description: 'Latest research on large language models',
          fileType: 'document',
          fileFormat: 'pdf',
          fileSize: 4800000, // 4.8 MB
          uploadDate: new Date('2023-03-05').toISOString(),
          lastModified: new Date('2023-03-05').toISOString(),
          collectionId: '2'
        },
        {
          id: '202',
          name: 'Data Visualization Examples',
          description: 'Examples of effective data visualizations',
          fileType: 'image',
          fileFormat: 'png',
          fileSize: 2100000, // 2.1 MB
          uploadDate: new Date('2023-04-12').toISOString(),
          lastModified: new Date('2023-04-12').toISOString(),
          collectionId: '2'
        },
        {
          id: '203',
          name: 'Conference Recording',
          description: 'Recording of the AI conference keynote',
          fileType: 'audio',
          fileFormat: 'mp3',
          fileSize: 15000000, // 15 MB
          uploadDate: new Date('2023-05-18').toISOString(),
          lastModified: new Date('2023-05-18').toISOString(),
          collectionId: '2'
        }
      ]
    },
    {
      id: '3',
      name: 'Personal Notes',
      description: 'Personal notes and ideas',
      createdAt: new Date('2023-04-20').toISOString(),
      updatedAt: new Date('2023-06-15').toISOString(),
      items: [
        {
          id: '301',
          name: 'Book Notes',
          description: 'Notes from books I\'ve read',
          fileType: 'document',
          fileFormat: 'txt',
          fileSize: 120000, // 120 KB
          uploadDate: new Date('2023-04-20').toISOString(),
          lastModified: new Date('2023-06-15').toISOString(),
          collectionId: '3'
        }
      ]
    }
  ],
  activeCollection: null,
  
  // Actions
  setActiveCollection: (id) => set({ activeCollection: id }),
  
  createCollection: (name, description) => set((state) => {
    const now = new Date().toISOString();
    return {
      collections: [
        ...state.collections,
        {
          id: uuidv4(),
          name,
          description,
          createdAt: now,
          updatedAt: now,
          items: []
        }
      ]
    };
  }),
  
  deleteCollection: (id) => set((state) => ({
    collections: state.collections.filter(collection => collection.id !== id),
    activeCollection: state.activeCollection === id ? null : state.activeCollection
  })),
  
  addItem: (collectionId, item) => set((state) => ({
    collections: state.collections.map(collection => 
      collection.id === collectionId
        ? {
            ...collection,
            updatedAt: new Date().toISOString(),
            items: [
              ...collection.items,
              {
                id: uuidv4(),
                collectionId,
                ...item
              }
            ]
          }
        : collection
    )
  })),
  
  removeItem: (itemId) => set((state) => ({
    collections: state.collections.map(collection => ({
      ...collection,
      updatedAt: collection.items.some(item => item.id === itemId) 
        ? new Date().toISOString() 
        : collection.updatedAt,
      items: collection.items.filter(item => item.id !== itemId)
    }))
  })),
  
  searchItems: (query) => {
    const { collections } = get();
    const lowerQuery = query.toLowerCase();
    
    return collections.flatMap(collection => 
      collection.items.filter(item => 
        item.name.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery)
      )
    );
  }
}));
