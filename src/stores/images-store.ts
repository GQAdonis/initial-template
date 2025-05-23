import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

// Define image interface
export interface GeneratedImage {
  id: string;
  title: string;
  prompt: string;
  imageUrl: string;
  thumbnail?: string;
  createdAt: Date;
  favorite: boolean;
  model: string;
  size: string;
}

// Define store state interface
interface ImagesState {
  images: GeneratedImage[];
  activeImage: string | null;
  isGenerating: boolean;
  generationProgress: number;
  
  // Actions
  toggleFavorite: (id: string) => void;
  generateImage: (prompt: string, model: string, size: string) => Promise<void>;
  deleteImage: (id: string) => void;
  searchImages: (query: string) => GeneratedImage[];
  setActiveImage: (id: string) => void;
  createNewImageSession: () => void;
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
      thumbnail: 'https://images.pexels.com/photos/1366909/pexels-photo-1366909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      createdAt: new Date('2023-05-15'),
      favorite: true,
      model: 'stable-diffusion-xl',
      size: '1024x1024'
    },
    {
      id: '2',
      title: 'Futuristic City',
      prompt: 'A futuristic city with flying cars and tall skyscrapers',
      imageUrl: 'https://images.pexels.com/photos/1563256/pexels-photo-1563256.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      thumbnail: 'https://images.pexels.com/photos/1563256/pexels-photo-1563256.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      createdAt: new Date('2023-06-10'),
      favorite: false,
      model: 'dall-e-3',
      size: '1024x1024'
    },
    {
      id: '3',
      title: 'Abstract Art',
      prompt: 'An abstract painting with vibrant colors and geometric shapes',
      imageUrl: 'https://images.pexels.com/photos/1585325/pexels-photo-1585325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      thumbnail: 'https://images.pexels.com/photos/1585325/pexels-photo-1585325.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      createdAt: new Date('2023-06-22'),
      favorite: false,
      model: 'midjourney',
      size: '512x512'
    },
    {
      id: '4',
      title: 'Underwater Scene',
      prompt: 'A vibrant underwater scene with coral reefs and tropical fish',
      imageUrl: 'https://images.pexels.com/photos/128756/pexels-photo-128756.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      thumbnail: 'https://images.pexels.com/photos/128756/pexels-photo-128756.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      createdAt: new Date('2023-07-05'),
      favorite: true,
      model: 'stable-diffusion-xl',
      size: '1024x1024'
    },
    {
      id: '5',
      title: 'Space Exploration',
      prompt: 'A futuristic space station orbiting a distant planet',
      imageUrl: 'https://images.pexels.com/photos/41162/moon-landing-apollo-11-nasa-buzz-aldrin-41162.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      thumbnail: 'https://images.pexels.com/photos/41162/moon-landing-apollo-11-nasa-buzz-aldrin-41162.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      createdAt: new Date('2023-07-18'),
      favorite: false,
      model: 'dall-e-3',
      size: '1024x1024'
    },
    {
      id: '6',
      title: 'Fantasy Castle',
      prompt: 'A magical castle on a floating island with waterfalls',
      imageUrl: 'https://images.pexels.com/photos/2832034/pexels-photo-2832034.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      thumbnail: 'https://images.pexels.com/photos/2832034/pexels-photo-2832034.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      createdAt: new Date('2023-08-02'),
      favorite: true,
      model: 'midjourney',
      size: '1024x1024'
    },
  ],
  activeImage: null,
  isGenerating: false,
  generationProgress: 0,
  
  // Actions
  toggleFavorite: (id) => {
    set((state) => ({
      images: state.images.map((image) =>
        image.id === id ? { ...image, favorite: !image.favorite } : image
      ),
    }));
  },

  // Set active image
  setActiveImage: (id) => {
    set({ activeImage: id });
  },

  // Create a new image session
  createNewImageSession: () => {
    set({ activeImage: null });
  },

  // Generate a new image
  generateImage: async (prompt, model, size) => {
    // Start generating
    set({ isGenerating: true, generationProgress: 0 });

    // Simulate progress
    const progressInterval = setInterval(() => {
      const currentProgress = get().generationProgress;
      if (currentProgress < 90) {
        set({ generationProgress: currentProgress + 10 });
      }
    }, 500);

    // Simulate API call with a delay
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Create a new image
      const newImage = {
        id: uuidv4(),
        title: prompt.split(' ').slice(0, 3).join(' '),
        prompt,
        imageUrl: 'https://source.unsplash.com/random/1024x1024/?'+encodeURIComponent(prompt),
        thumbnail: 'https://source.unsplash.com/random/300x300/?'+encodeURIComponent(prompt),
        createdAt: new Date(),
        favorite: false,
        model,
        size,
      };

      // Update state
      set((state) => ({
        isGenerating: false,
        generationProgress: 100,
        images: [newImage, ...state.images],
        activeImage: newImage.id,
      }));

      // Clear interval
      clearInterval(progressInterval);
    } catch (error) {
      console.error('Error generating image:', error);
      set({ isGenerating: false, generationProgress: 0 });
      clearInterval(progressInterval);
    }
  },

  // Delete an image
  deleteImage: (id) => {
    set((state) => ({ 
      images: state.images.filter((image) => image.id !== id),
      activeImage: state.activeImage === id ? null : state.activeImage,
    }));
  },

  // Search images
  searchImages: (query) => {
    const lowerQuery = query.toLowerCase();
    return get().images.filter(
      (image) =>
        image.title.toLowerCase().includes(lowerQuery) ||
        image.prompt.toLowerCase().includes(lowerQuery)
    );
  },
}));
