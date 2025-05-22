import { useLoaderData } from 'react-router-dom';
import ChatLayout from '@/components/ChatLayout';

interface IndexLoaderData {
  isTauriEnvironment: boolean;
  appVersion: string;
  initialLoadTime: string;
}

const Index = () => {
  // Access the data returned from the loader function
  const loaderData = useLoaderData() as IndexLoaderData;
  
  console.log('Index page loaded with data:', loaderData);
  
  return <ChatLayout />;
};

export default Index;
