declare module '@assistant-ui/react' {
  import { ComponentType, ReactNode, HTMLAttributes } from 'react';

  // Thread Primitive Components
  export namespace ThreadPrimitive {
    interface RootProps extends HTMLAttributes<HTMLDivElement> {
      children?: ReactNode;
    }
    export const Root: ComponentType<RootProps>;

    interface ViewportProps extends HTMLAttributes<HTMLDivElement> {
      children?: ReactNode;
    }
    export const Viewport: ComponentType<ViewportProps>;

    interface MessagesProps {
      components?: {
        UserMessage?: ComponentType;
        EditComposer?: ComponentType;
        AssistantMessage?: ComponentType;
      };
    }
    export const Messages: ComponentType<MessagesProps>;

    interface IfProps {
      children?: ReactNode;
      empty?: boolean;
      running?: boolean;
    }
    export const If: ComponentType<IfProps>;

    interface ScrollToBottomProps extends HTMLAttributes<HTMLButtonElement> {
      asChild?: boolean;
      children?: ReactNode;
    }
    export const ScrollToBottom: ComponentType<ScrollToBottomProps>;

    interface EmptyProps {
      children?: ReactNode;
    }
    export const Empty: ComponentType<EmptyProps>;

    interface SuggestionProps extends HTMLAttributes<HTMLButtonElement> {
      prompt: string;
      method?: 'append' | 'replace';
      autoSend?: boolean;
      children?: ReactNode;
    }
    export const Suggestion: ComponentType<SuggestionProps>;
  }

  // ThreadList Primitive Components
  export namespace ThreadListPrimitive {
    interface RootProps extends HTMLAttributes<HTMLDivElement> {
      children?: ReactNode;
    }
    export const Root: ComponentType<RootProps>;

    interface NewProps extends HTMLAttributes<HTMLButtonElement> {
      asChild?: boolean;
      children?: ReactNode;
    }
    export const New: ComponentType<NewProps>;

    interface ItemsProps {
      components?: {
        ThreadListItem?: ComponentType;
      };
    }
    export const Items: ComponentType<ItemsProps>;
  }

  // ThreadListItem Primitive Components
  export namespace ThreadListItemPrimitive {
    interface RootProps extends HTMLAttributes<HTMLDivElement> {
      children?: ReactNode;
    }
    export const Root: ComponentType<RootProps>;

    interface TriggerProps extends HTMLAttributes<HTMLButtonElement> {
      children?: ReactNode;
    }
    export const Trigger: ComponentType<TriggerProps>;

    interface TitleProps {
      fallback?: string;
    }
    export const Title: ComponentType<TitleProps>;

    interface ArchiveProps extends HTMLAttributes<HTMLButtonElement> {
      asChild?: boolean;
      children?: ReactNode;
    }
    export const Archive: ComponentType<ArchiveProps>;
  }

  // Message Primitive Components
  export namespace MessagePrimitive {
    interface RootProps extends HTMLAttributes<HTMLDivElement> {
      children?: ReactNode;
    }
    export const Root: ComponentType<RootProps>;

    interface ContentProps {
      components?: {
        Text?: ComponentType<{ children?: ReactNode }>;
      };
    }
    export const Content: ComponentType<ContentProps>;

    interface IfProps {
      children?: ReactNode;
      copied?: boolean;
    }
    export const If: ComponentType<IfProps>;

    interface ErrorProps {
      children?: ReactNode;
    }
    export const Error: ComponentType<ErrorProps>;
  }

  // Composer Primitive Components
  export namespace ComposerPrimitive {
    interface RootProps extends HTMLAttributes<HTMLDivElement> {
      children?: ReactNode;
    }
    export const Root: ComponentType<RootProps>;

    interface InputProps extends HTMLAttributes<HTMLTextAreaElement> {
      rows?: number;
      autoFocus?: boolean;
      placeholder?: string;
    }
    export const Input: ComponentType<InputProps>;

    interface SendProps extends HTMLAttributes<HTMLButtonElement> {
      asChild?: boolean;
      children?: ReactNode;
    }
    export const Send: ComponentType<SendProps>;

    interface CancelProps extends HTMLAttributes<HTMLButtonElement> {
      asChild?: boolean;
      children?: ReactNode;
    }
    export const Cancel: ComponentType<CancelProps>;
  }

  // ActionBar Primitive Components
  export namespace ActionBarPrimitive {
    interface RootProps extends HTMLAttributes<HTMLDivElement> {
      hideWhenRunning?: boolean;
      autohide?: boolean | 'not-last' | 'never';
      autohideFloat?: 'single-branch' | boolean;
      children?: ReactNode;
    }
    export const Root: ComponentType<RootProps>;

    interface EditProps extends HTMLAttributes<HTMLButtonElement> {
      asChild?: boolean;
      children?: ReactNode;
    }
    export const Edit: ComponentType<EditProps>;

    interface CopyProps extends HTMLAttributes<HTMLButtonElement> {
      asChild?: boolean;
      children?: ReactNode;
    }
    export const Copy: ComponentType<CopyProps>;

    interface ReloadProps extends HTMLAttributes<HTMLButtonElement> {
      asChild?: boolean;
      children?: ReactNode;
    }
    export const Reload: ComponentType<ReloadProps>;
  }

  // BranchPicker Primitive Components
  export namespace BranchPickerPrimitive {
    interface RootProps extends HTMLAttributes<HTMLDivElement> {
      hideWhenSingleBranch?: boolean;
      children?: ReactNode;
    }
    export const Root: ComponentType<RootProps>;

    interface PreviousProps extends HTMLAttributes<HTMLButtonElement> {
      asChild?: boolean;
      children?: ReactNode;
    }
    export const Previous: ComponentType<PreviousProps>;

    interface NextProps extends HTMLAttributes<HTMLButtonElement> {
      asChild?: boolean;
      children?: ReactNode;
    }
    export const Next: ComponentType<NextProps>;

    export const Number: ComponentType;
    export const Count: ComponentType;
  }

  // Error Primitive Components
  export namespace ErrorPrimitive {
    interface RootProps extends HTMLAttributes<HTMLDivElement> {
      children?: ReactNode;
    }
    export const Root: ComponentType<RootProps>;

    interface MessageProps extends HTMLAttributes<HTMLDivElement> {
      children?: ReactNode;
    }
    export const Message: ComponentType<MessageProps>;
  }
}
