# Context-Aware UI Architecture

## Overview

This document outlines the context-aware UI architecture implemented in the One application. The architecture is designed to provide users with a consistent navigation experience while dynamically adapting content based on the current application context.

## Core Concepts

### 1. Multi-Modal Workspace Hub Pattern

The One application follows the Multi-Modal Workspace Hub Pattern, which organizes multiple specialized applications within a unified workspace environment. This pattern is characterized by:

- **Central Navigation Hub**: A persistent navigation system for switching between different functional areas
- **Contextual Workspaces**: Specialized interfaces optimized for specific tasks
- **Shared Resources**: Data and context accessible across different applications
- **Consistent Interaction Patterns**: Common UI elements and behaviors

### 2. Context-Aware Navigation

The navigation system adapts based on the active application section:

- **Desktop**: Persistent sidebar with consistent positioning
- **Mobile**: Slide-out sidebar with context-specific content

### 3. State Management Architecture

Each application section has a dedicated Zustand store that manages its specific state:

- **Navigation Store**: Global navigation state
- **Home Store**: Home page content and features
- **Chat Store**: Conversation management
- **Library Store**: Knowledge base collections and items
- **Images Store**: Generated images and creation workflow

## Mobile Navigation Implementation

### MobileSidebar Component

The `MobileSidebar` component is the primary implementation of context-aware navigation on mobile devices. It:

1. Detects the current application context via `useNavigationStore`
2. Renders different content based on `activePath`
3. Provides context-specific actions
4. Maintains consistent UI patterns across contexts

### Context-Specific Content

The sidebar content changes based on the active application section:

#### Home Context (`/`)
- **Content Type**: Featured items in list view
- **Item Format**: Icon, title, subtitle
- **Primary Action**: "New Item"
- **Data Source**: `featuredLinks` from Home Store

#### Chat Context (`/chat`)
- **Content Type**: Conversation history
- **Item Format**: Icon, chat title, date
- **Primary Action**: "New Chat"
- **Data Source**: `chats` from Chat Store

#### Library Context (`/library`)
- **Content Type**: Knowledge base collection
- **Item Format**: Icon, document title, category, date
- **Primary Action**: "Browse Library"
- **Data Source**: `collections` from Library Store

#### Images Context (`/images`)
- **Content Type**: Image history
- **Item Format**: Thumbnail, image title, date
- **Primary Action**: "Create Image"
- **Data Source**: `images` from Images Store

### Implementation Details

The `MobileSidebar` component uses several key functions to implement context-awareness:

1. `getContextTitle()`: Returns the appropriate title based on active path
2. `getActionButton()`: Renders a context-specific primary action button
3. `renderContextContent()`: Renders the appropriate content list for the current context

## Store Architecture

### Home Store (`home-store.ts`)

Manages content displayed on the home page.

**Key State:**
- `heroContent`: Array of hero carousel items
- `featuredLinks`: Featured application sections
- `callToAction`: Primary CTA button
- `currentHeroIndex`: Active hero slide index

**Data Structure:**
```typescript
interface HeroContent {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
}

interface FeaturedLink {
  id: string;
  title: string;
  subtitle: string;
  icon: IconComponent;
  path: string;
}
```

### Library Store (`library-store.ts`)

Manages knowledge base collections and items.

**Key State:**
- `collections`: Knowledge base collections
- `activeCollection`: Currently selected collection ID

**Data Structure:**
```typescript
interface KnowledgeItem {
  id: string;
  name: string;
  description: string;
  fileType: 'document' | 'image' | 'video' | 'audio';
  fileFormat: string;
  fileSize: number;
  filePath: string;
  uploadDate: string;
  lastModified: string;
  tags: string[];
  vectorEmbedding?: boolean;
}

interface KnowledgeCollection {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  items: KnowledgeItem[];
}
```

### Images Store (`images-store.ts`)

Manages generated images and image creation workflow.

**Key State:**
- `images`: Array of generated images
- `activeImage`: Currently selected image ID
- `isGenerating`: Image generation status
- `generationProgress`: Generation progress percentage

**Data Structure:**
```typescript
interface GeneratedImage {
  id: string;
  name: string;
  title: string;
  description: string;
  fileName: string;
  creationDate: string;
  prompt: string;
  negativePrompt?: string;
  provider: 'fal.ai' | 'replicate' | 'stability' | 'openai';
  model: string;
  generationTime: number;
  width: number;
  height: number;
  tags: string[];
  favorite: boolean;
  imageUrl: string;
}
```

## UI Components and Patterns

### 1. Navigation Sidebar

The primary navigation mechanism is a collapsible sidebar that provides access to all workspaces.

**Specifications:**
- Width: 240px (expanded), 64px (collapsed)
- Persistent on desktop, collapsible on mobile
- Contains workspace icons with labels
- Visual indicators for the active workspace

### 2. Mobile Sidebar

A slide-out panel that provides context-specific content and actions.

**Specifications:**
- Full-height, partial-width overlay (max-width: 320px)
- Semi-transparent backdrop
- Context-specific header and action button
- Scrollable content area with consistent item styling

### 3. Content Cards

Consistent card patterns that adapt to different content types.

**Specifications:**
- 8px border radius
- Consistent padding (16px)
- Hover and selection states
- Responsive adaptations for different screen sizes

## Responsive Design Strategy

The application employs a comprehensive responsive design strategy:

### Desktop (1024px+)
- Full sidebar navigation with optional collapse
- Multi-column layouts for content-rich views
- Side-by-side panels for related content

### Tablet (768px - 1023px)
- Collapsible sidebar with easy access toggle
- Simplified layouts with fewer columns
- Sequential presentation of related content

### Mobile (< 768px)
- Bottom navigation bar for primary workspaces
- Single-column layouts with progressive disclosure
- Context-aware slide-out sidebar for secondary navigation

## Design Principles

1. **Focus on Primary Tasks**: Each workspace emphasizes its primary function while minimizing distractions
2. **Consistent Navigation**: Navigation elements maintain consistent positioning and behavior
3. **Contextual Controls**: Controls and information are presented contextually
4. **Fluid Transitions**: Smooth transitions between workspaces and states
5. **Scalable Density**: Interface adapts its information density based on device and screen size

## Implementation Benefits

This context-aware UI architecture provides several key benefits:

1. **Reduced Cognitive Load**: Users only see relevant options for their current context
2. **Efficient Navigation**: Context-specific actions are readily available
3. **Consistent Experience**: Maintains a consistent UI pattern while adapting content
4. **Optimized for Mobile**: Designed specifically for touch and smaller screens
5. **Extensible Framework**: New contexts can be added without disrupting existing patterns

## Future Enhancements

1. **Gesture Support**: Add swipe gestures for navigation
2. **Context-Specific Search**: Implement search within the current context
3. **Personalization**: Allow users to customize their context-specific views
4. **Cross-Context Actions**: Enable actions that span multiple contexts
5. **Offline Support**: Add offline capabilities with local storage

---

This architecture document serves as a foundation for the One application's UI implementation, establishing patterns and principles that guide development decisions while allowing for evolution as user needs and technological capabilities advance.
