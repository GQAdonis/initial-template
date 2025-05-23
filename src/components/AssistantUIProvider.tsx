import { ReactNode } from 'react';

interface AssistantUIProviderProps {
  children: ReactNode;
}

/**
 * A provider component that wraps the application.
 * This is a placeholder for future AI provider functionality.
 * Currently, the AI functionality is handled directly in the ChatUI component.
 */
export function AssistantUIProvider({ children }: AssistantUIProviderProps) {
  return <>{children}</>;
}
