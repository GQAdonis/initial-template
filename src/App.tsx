import { useEffect } from 'react';
import { useNavigationStore } from './stores/navigation-store';
import ApplicationContainer from './components/ApplicationContainer';
import { ThemeProvider } from './components/ui/theme-provider';

function App() {
  const { setMobileView } = useNavigationStore();
  
  // Check for mobile view on mount and window resize
  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 768);
    };
    
    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setMobileView]);

  return (
    <ThemeProvider defaultTheme="light" storageKey="prometheus-theme">
      <ApplicationContainer />
    </ThemeProvider>
  );
}

export default App;
