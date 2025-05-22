import { useLoaderData } from 'react-router-dom';

interface IndexLoaderData {
  isTauriEnvironment: boolean;
  appVersion: string;
  initialLoadTime: string;
}

const Index = () => {
  // Access the data returned from the loader function
  const loaderData = useLoaderData() as IndexLoaderData;
  
  console.log('Index page loaded with data:', loaderData);
  
  // This component is now just a placeholder as ApplicationContainer is rendered at the App level
  return null;
};

export default Index;
