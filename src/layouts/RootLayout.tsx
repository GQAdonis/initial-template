import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';

const RootLayout = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="one-ui-theme">
      <div className="min-h-screen bg-background">
        <Outlet />
        <Toaster />
      </div>
    </ThemeProvider>
  );
};

export default RootLayout;
