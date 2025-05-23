import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigationStore } from '@/stores/navigation-store';
import { MessageSquare, BookOpen, Image } from 'lucide-react';

const HomeLayout = () => {
  const { setActivePath } = useNavigationStore();

  const navigateToChat = () => {
    setActivePath('/chat');
  };

  return (
    <div className="flex flex-col h-full w-full overflow-auto bg-white dark:bg-gray-900">
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-12">
            <svg 
              width="80" 
              height="80" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto mb-6"
            >
              {/* Simple placeholder logo - replace with actual logo SVG */}
              <path 
                d="M12 2L2 7L12 12L22 7L12 2Z" 
                fill="currentColor" 
                stroke="currentColor" 
                strokeWidth="1.5" 
              />
              <path 
                d="M2 17L12 22L22 17" 
                stroke="currentColor" 
                strokeWidth="1.5" 
              />
              <path 
                d="M2 12L12 17L22 12" 
                stroke="currentColor" 
                strokeWidth="1.5" 
              />
            </svg>
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Welcome to One
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Your AI-powered growth partner for strategic insights and business intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-yellow-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Strategic Conversations</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Engage in detailed discussions about your business goals and challenges.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-yellow-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Knowledge Library</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Access a comprehensive collection of business insights and resources.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-4">
                <Image className="h-6 w-6 text-yellow-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Visual Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Generate and analyze visual representations of your business data.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Button 
              onClick={navigateToChat}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-6 py-6 rounded-lg flex items-center justify-center gap-2 mx-auto"
            >
              <span>Start a conversation</span>
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeLayout;
