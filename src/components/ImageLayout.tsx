import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import ImageGenerationView from './ImageGenerationView';
import { useImagesStore } from '@/stores/images-store';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const ImageLayout = () => {
  const { images, isGenerating } = useImagesStore();
  const [isMobile, setIsMobile] = useState(false);
  const [activeView, setActiveView] = useState<'generation' | 'detail'>('generation');
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

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

  const handleNewImage = () => {
    setActiveView('generation');
    setSelectedImageId(null);
  };

  const handleSelectImage = (id: string) => {
    setSelectedImageId(id);
    setActiveView('detail');
  };

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      {/* Images Sidebar */}
      <SidebarProvider defaultOpen={!isMobile}>
        <Sidebar variant="floating" side="left">
          <SidebarHeader>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <h1 className="font-bold text-lg">Images</h1>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <div className="p-4">
              <Button 
                onClick={handleNewImage}
                variant="outline" 
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium flex items-center justify-center gap-2 border-none shadow-sm py-5"
                disabled={isGenerating}
              >
                <Plus size={18} />
                <span>Create Image</span>
              </Button>
            </div>
            <div className="px-4 py-2">
              <h2 className="text-sm font-semibold mb-3 text-gray-500">Recent images</h2>
              <SidebarMenu>
                {images.map((image) => (
                  <SidebarMenuItem key={image.id}>
                    <button
                      className={`flex items-center gap-3 w-full p-2 rounded-lg transition-colors ${
                        selectedImageId === image.id 
                          ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-500' 
                          : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-300'
                      }`}
                      onClick={() => handleSelectImage(image.id)}
                    >
                      <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                        <img 
                          src={image.imageUrl} 
                          alt={image.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col items-start overflow-hidden">
                        <span className="truncate w-full text-left">{image.title}</span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(image.creationDate), 'MM/dd/yyyy')}
                        </span>
                      </div>
                    </button>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </div>
          </SidebarContent>
        </Sidebar>

        {/* Main content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Mobile header */}
          <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <SidebarTrigger />
            <div className="flex items-center">
              <span className="font-bold text-lg">Images</span>
            </div>
            <div className="w-8"></div> {/* Spacer for centering */}
          </div>

          {/* Image Content */}
          {activeView === 'generation' ? (
            <ImageGenerationView />
          ) : (
            <div className="flex-1 flex flex-col overflow-auto p-4">
              {selectedImageId && (
                <ImageDetailView 
                  imageId={selectedImageId} 
                  onBack={() => setActiveView('generation')}
                />
              )}
            </div>
          )}
        </div>
      </SidebarProvider>
    </div>
  );
};

// Simple Image Detail View component
const ImageDetailView = ({ imageId, onBack }: { imageId: string, onBack: () => void }) => {
  const { images } = useImagesStore();
  const image = images.find(img => img.id === imageId);

  if (!image) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p>Image not found</p>
        <Button onClick={onBack} variant="outline" className="mt-4">
          Back to Generation
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <Button onClick={onBack} variant="outline" size="sm">
          Back to Generation
        </Button>
        <h2 className="text-xl font-bold">{image.title}</h2>
        <div></div> {/* Empty div for flex spacing */}
      </div>
      
      <div className="flex-1 flex flex-col items-center overflow-auto">
        <div className="max-w-2xl w-full">
          <div className="rounded-lg overflow-hidden mb-4">
            <img 
              src={image.imageUrl} 
              alt={image.title} 
              className="w-full h-auto"
            />
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Image Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Prompt:</span>
                <span>{image.prompt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Model:</span>
                <span>{image.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Size:</span>
                <span>{image.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Created:</span>
                <span>{format(new Date(image.creationDate), 'PPP')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageLayout;
