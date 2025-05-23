import ImageGenerationView from './ImageGenerationView';

/**
 * ImageLayout component that integrates the ImageGenerationView component.
 * This component follows the context-aware UI architecture by properly positioning
 * the image generation UI within the application's main layout.
 * 
 * Note: The ImageSidebar component is now used directly in the Navigation component
 * for desktop view and in the MobileSidebar component for mobile view.
 */
const ImageLayout = () => {
  return (
    <div className="flex flex-1 h-full w-full overflow-hidden transition-all duration-300 ease-in-out">
      {/* Main content */}
      <div className="flex-1 flex flex-col h-full w-full min-h-0 min-w-0 overflow-hidden transition-all duration-300 ease-in-out">
        {/* Image Generation UI */}
        <ImageGenerationView />
      </div>
    </div>
  );
};

export default ImageLayout;
