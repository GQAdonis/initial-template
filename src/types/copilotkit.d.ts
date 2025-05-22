declare module '@copilotkit/react-core' {
  import { ReactNode } from 'react';

  interface CopilotKitProps {
    runtimeUrl?: string;
    agent?: string;
    children: ReactNode;
  }

  export const CopilotKit: React.FC<CopilotKitProps>;
}

declare module '@copilotkit/react-ui' {
  import { ReactNode } from 'react';

  interface CopilotChatProps {
    className?: string;
    labels?: {
      placeholder?: string;
      initial?: string;
    };
    children?: ReactNode;
  }

  export const CopilotChat: React.FC<CopilotChatProps>;
}
