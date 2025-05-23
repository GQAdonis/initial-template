import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Home, MessageSquare, BookOpen, Image } from 'lucide-react';

// Define types for hero content
interface HeroContent {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
}

// Define types for featured links
interface FeaturedLink {
  id: string;
  title: string;
  subtitle: string;
  icon: typeof Home | typeof MessageSquare | typeof BookOpen | typeof Image;
  path: string;
}

// Define types for call to action
interface CallToAction {
  text: string;
  path: string;
}

// Define the store state
interface HomeState {
  heroContent: HeroContent[];
  featuredLinks: FeaturedLink[];
  callToAction: CallToAction;
  currentHeroIndex: number;
  
  // Actions
  addHeroContent: (content: Omit<HeroContent, 'id'>) => void;
  removeHeroContent: (id: string) => void;
  updateHeroContent: (id: string, content: Partial<HeroContent>) => void;
  
  addFeaturedLink: (link: Omit<FeaturedLink, 'id'>) => void;
  removeFeaturedLink: (id: string) => void;
  updateFeaturedLink: (id: string, link: Partial<FeaturedLink>) => void;
  
  updateCallToAction: (cta: CallToAction) => void;
  
  nextHeroSlide: () => void;
  prevHeroSlide: () => void;
  setHeroIndex: (index: number) => void;
}

// Create the store
export const useHomeStore = create<HomeState>((set) => ({
  // Initial hero content
  heroContent: [
    {
      id: uuidv4(),
      title: 'Strategic Business Intelligence',
      subtitle: 'Gain insights into your market and competition',
      imageUrl: 'https://images.pexels.com/photos/7947541/pexels-photo-7947541.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      ctaText: 'Learn More',
      ctaLink: '/chat'
    },
    {
      id: uuidv4(),
      title: 'Data-Driven Decision Making',
      subtitle: 'Transform your business with actionable insights',
      imageUrl: 'https://images.pexels.com/photos/6476260/pexels-photo-6476260.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      ctaText: 'Explore',
      ctaLink: '/library'
    },
    {
      id: uuidv4(),
      title: 'Visual Analytics',
      subtitle: 'See your data in a whole new light',
      imageUrl: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      ctaText: 'Generate',
      ctaLink: '/images'
    }
  ],
  
  // Initial featured links
  featuredLinks: [
    {
      id: uuidv4(),
      title: 'Strategic Conversations',
      subtitle: 'Engage in detailed discussions about your business goals and challenges',
      icon: MessageSquare,
      path: '/chat'
    },
    {
      id: uuidv4(),
      title: 'Knowledge Library',
      subtitle: 'Access a comprehensive collection of business insights and resources',
      icon: BookOpen,
      path: '/library'
    },
    {
      id: uuidv4(),
      title: 'Visual Analytics',
      subtitle: 'Generate and analyze visual representations of your business data',
      icon: Image,
      path: '/images'
    }
  ],
  
  // Initial call to action
  callToAction: {
    text: 'Start a conversation',
    path: '/chat'
  },
  
  // Current hero index
  currentHeroIndex: 0,
  
  // Add hero content
  addHeroContent: (content) => {
    set((state) => ({
      heroContent: [...state.heroContent, { id: uuidv4(), ...content }]
    }));
  },
  
  // Remove hero content
  removeHeroContent: (id) => {
    set((state) => ({
      heroContent: state.heroContent.filter((item) => item.id !== id)
    }));
  },
  
  // Update hero content
  updateHeroContent: (id, content) => {
    set((state) => ({
      heroContent: state.heroContent.map((item) => 
        item.id === id ? { ...item, ...content } : item
      )
    }));
  },
  
  // Add featured link
  addFeaturedLink: (link) => {
    set((state) => ({
      featuredLinks: [...state.featuredLinks, { id: uuidv4(), ...link }]
    }));
  },
  
  // Remove featured link
  removeFeaturedLink: (id) => {
    set((state) => ({
      featuredLinks: state.featuredLinks.filter((item) => item.id !== id)
    }));
  },
  
  // Update featured link
  updateFeaturedLink: (id, link) => {
    set((state) => ({
      featuredLinks: state.featuredLinks.map((item) => 
        item.id === id ? { ...item, ...link } : item
      )
    }));
  },
  
  // Update call to action
  updateCallToAction: (cta) => {
    set({ callToAction: cta });
  },
  
  // Next hero slide
  nextHeroSlide: () => {
    set((state) => ({
      currentHeroIndex: (state.currentHeroIndex + 1) % state.heroContent.length
    }));
  },
  
  // Previous hero slide
  prevHeroSlide: () => {
    set((state) => ({
      currentHeroIndex: (state.currentHeroIndex - 1 + state.heroContent.length) % state.heroContent.length
    }));
  },
  
  // Set hero index
  setHeroIndex: (index) => {
    set({ currentHeroIndex: index });
  }
}));
