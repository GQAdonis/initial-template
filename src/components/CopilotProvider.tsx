import React, { ReactNode } from 'react';
import { CopilotKit } from '@copilotkit/react-core';

// Define props interface for the component
interface CopilotProviderProps {
  children: ReactNode;
}

/**
 * CopilotProvider component that wraps the application and configures CopilotKit
 * to connect to the backend endpoint.
 */
export const CopilotProvider: React.FC<CopilotProviderProps> = ({ children }) => {
  // Get the runtime URL from environment variables
  // Fallback to a default value if not provided
  const runtimeUrl = import.meta.env.VITE_COPILOT_API_URL || 'http://localhost:3000/api/copilot';
  
  console.log('CopilotKit using runtime URL:', runtimeUrl);
  
  return (
    <CopilotKit
      runtimeUrl={runtimeUrl}
    >
      {children}
    </CopilotKit>
  );
};

export default CopilotProvider;
