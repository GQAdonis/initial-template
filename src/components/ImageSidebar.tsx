import { Button } from '@/components/ui/button';
import { useImagesStore } from '@/stores/images-store';
import { PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

interface ImageSidebarProps {
  className?: string;
}

/**
 * ImageSidebar component that displays recent images and provides a button to create a new image.
 * This component follows the context-aware UI architecture and can be placed independently.
 */
const ImageSidebar = ({ className }: ImageSidebarProps) => {
  const { images, setActiveImage, activeImage, createNewImageSession } = useImagesStore();

  // Handle creating a new image
  const handleNewImage = () => {
    createNewImageSession();
  };

  return (
    <div className={cn("flex flex-col gap-2 ", className)}>
      {/* New Image button */}
      <div className="p-4">
        <Button 
          onClick={handleNewImage}
          className="whitespace-nowrap h-9 px-4 w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium flex items-center justify-center gap-2 border-none shadow-sm py-5"
        >
          <PlusCircle size={18} />
          <span>New Image</span>
        </Button>
      </div>

      {/* Recent images */}
      <div className="px-4 py-2">
        <h2 className="text-sm font-semibold mb-3 text-gray-500">Recent images</h2>
        <ul className="flex w-full min-w-0 flex-col gap-1">
          {images.map((image) => (
            <li key={image.id} className="group relative">
              <button
                onClick={() => setActiveImage(image.id)}
                className={cn(
                  "flex w-full items-center gap-2 overflow-hidden rounded-md py-2 text-left outline-none transition-all",
                  activeImage === image.id
                    ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground px-2 mr-3"
                    : "hover:bg-sidebar-hover hover:text-sidebar-hover-foreground px-2"
                )}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md overflow-hidden">
                  {image.thumbnail ? (
                    <img src={image.thumbnail} alt={image.title} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs">🖼️</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">
                    {image.title || "Untitled Image"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(image.createdAt)}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ImageSidebar;
