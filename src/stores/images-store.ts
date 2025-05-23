import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

// Define image interface
export interface GeneratedImage {
  id: string;
  title: string;
  prompt: string;
  imageUrl: string;
  creationDate: string;
  favorite: boolean;
  model: string;
  size: string;
}

// Define store state interface
interface ImagesState {
  images: GeneratedImage[];
  isGenerating: boolean;
  generationProgress: number;
  
  // Actions
  toggleFavorite: (id: string) => void;
  generateImage: (prompt: string, model: string, size: string) => Promise<void>;
  deleteImage: (id: string) => void;
  searchImages: (query: string) => GeneratedImage[];
}

// Create the store
export const useImagesStore = create<ImagesState>((set, get) => ({
  // Initial state with sample data
  images: [
    {
      id: '1',
      title: 'Mountain Landscape',
      prompt: 'A beautiful mountain landscape with snow-capped peaks and a clear blue sky',
      imageUrl: 'https://images.pexels.com/photos/1366909/pexels-photo-1366909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      creationDate: new Date('2023-05-15').toISOString(),
      favorite: true,
      model: 'stable-diffusion-xl',
      size: '1024x1024'
    },
    {
      id: '2',
      title: 'Futuristic City',
      prompt: 'A futuristic city with flying cars and tall skyscrapers',
      imageUrl: 'https://images.pexels.com/photos/1563256/pexels-photo-1563256.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      creationDate: new Date('2023-06-10').toISOString(),
      favorite: false,
      model: 'dall-e-3',
      size: '1024x1024'
    },
    {
      id: '3',
      title: 'Abstract Art',
      prompt: 'Abstract art with vibrant colors and geometric shapes',
      imageUrl: 'https://images.pexels.com/photos/2110951/pexels-photo-2110951.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      creationDate: new Date('2023-06-22').toISOString(),
      favorite: true,
      model: 'flux-1.1-pro',
      size: '1024x768'
    },
    {
      id: '4',
      title: 'Underwater Scene',
      prompt: 'A colorful underwater scene with coral reefs and tropical fish',
      imageUrl: 'https://images.pexels.com/photos/3801990/pexels-photo-3801990.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      creationDate: new Date('2023-07-05').toISOString(),
      favorite: false,
      model: 'stable-diffusion-3',
      size: '768x1024'
    },
    {
      id: '5',
      title: 'Space Exploration',
      prompt: 'A spacecraft exploring a distant galaxy with colorful nebulae',
      imageUrl: 'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      creationDate: new Date('2023-07-18').toISOString(),
      favorite: true,
      model: 'dall-e-3',
      size: '1024x1024'
    },
    {
      id: '6',
      title: 'Fantasy Castle',
      prompt: 'A magical fantasy castle on a floating island with waterfalls',
      imageUrl: 'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      creationDate: new Date('2023-08-02').toISOString(),
      favorite: false,
      model: 'stable-diffusion-xl',
      size: '1024x768'
    }
  ],
  isGenerating: false,
  generationProgress: 0,
  
  // Actions
  toggleFavorite: (id) => set((state) => ({
    images: state.images.map(image => 
      image.id === id 
        ? { ...image, favorite: !image.favorite } 
        : image
    )
  })),
  
  generateImage: async (prompt, model, size) => {
    // Start generation
    set({ isGenerating: true, generationProgress: 0 });
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      set((state) => ({
        generationProgress: Math.min(state.generationProgress + 10, 90)
      }));
    }, 500);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    clearInterval(progressInterval);
    
    // Complete generation
    set((state) => ({
      isGenerating: false,
      generationProgress: 100,
      images: [
        {
          id: uuidv4(),
          title: prompt.split(' ').slice(0, 3).join(' '),
          prompt,
          imageUrl: 'https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Placeholder
          creationDate: new Date().toISOString(),
          favorite: false,
          model,
          size
        },
        ...state.images
      ]
    }));
    
    // Reset progress after a delay
    setTimeout(() => {
      set({ generationProgress: 0 });
    }, 2000);
  },
  
  deleteImage: (id) => set((state) => ({
    images: state.images.filter(image => image.id !== id)
  })),
  
  searchImages: (query) => {
    const { images } = get();
    const lowerQuery = query.toLowerCase();
    
    return images.filter(image => 
      image.title.toLowerCase().includes(lowerQuery) ||
      image.prompt.toLowerCase().includes(lowerQuery)
    );
  }
}));
