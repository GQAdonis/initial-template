import ChatUI from './ChatUI';

/**
 * ChatLayout component that integrates the ChatUI component.
 * This component follows the context-aware UI architecture by properly positioning
 * the chat UI within the application's main layout.
 * 
 * Note: The ChatSidebar component is now used directly in the Navigation component
 * for desktop view and in the MobileSidebar component for mobile view.
 */
const ChatLayout = () => {
  return (
    <div className="flex flex-1 h-full overflow-hidden">
      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Chat UI */}
        <ChatUI />
      </div>
    </div>
  );
};

export default ChatLayout;
