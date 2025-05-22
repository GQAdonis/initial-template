import React, { ReactNode } from 'react';
import { CopilotKit } from '@copilotkit/react-core';

// Define props interface for the component
interface CopilotProviderProps {
  children: ReactNode;
}

/**
 * CopilotProvider component that wraps the application and configures CopilotKit
 * to connect to the Tauri backend endpoint.
 */
export const CopilotProvider: React.FC<CopilotProviderProps> = ({ children }) => {
  // Configure the endpoint URL
  // In Tauri, we use a relative path that will be handled by the Rust backend
  const endpointUrl = '/api/copilotkit';

  return (
    <CopilotKit
      runtimeUrl={endpointUrl}
      // Use a string for the agent property
      agent="copilot-assistant"
    >
      {children}
    </CopilotKit>
  );
};

export default CopilotProvider;