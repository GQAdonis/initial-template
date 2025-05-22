import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { CopilotKit } from "@copilotkit/react-core";
import { isTauri } from "@/utils/platform";
import "@/styles/app-layout.css";

const RootLayout = () => {
  const isTauriEnv = isTauri();

  return (
    <ThemeProvider defaultTheme="light">
      <CopilotKit
        runtimeUrl={isTauriEnv ? "http://localhost:3000/api/copilotkit" : "/api/copilotkit"}
        agent="copilot-assistant"
      >
        <div className="app-container">
          <Outlet />
        </div>
        <Toaster />
        <Sonner />
      </CopilotKit>
    </ThemeProvider>
  );
};

export default RootLayout;
