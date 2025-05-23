# Mobile Navigation UI Architecture

## Overview

This document outlines the architecture for context-aware mobile navigation in the One application. The mobile navigation system dynamically changes its content based on the currently active application section, providing users with relevant options and information specific to their current context.

## Core Principles

1. **Context Awareness**: The sidebar content adapts based on the active application section
2. **Consistent UI Pattern**: While content changes, the overall UI pattern remains consistent
3. **Relevant Actions**: Primary action buttons change based on context
4. **Optimized for Mobile**: All interactions are designed for touch and smaller screens

## Navigation Contexts

The application features four main contexts, each with its own specialized sidebar content:

### 1. Home Context (`/`)
- **Content Type**: Featured items in list view
- **Item Format**: Icon, title, subtitle
- **Primary Action**: "New Item"
- **Use Case**: Quick access to featured application capabilities

### 2. Chat Context (`/chat`)
- **Content Type**: Conversation history
- **Item Format**: Icon, chat title, date
- **Primary Action**: "New Chat"
- **Use Case**: Access to previous conversations

### 3. Library Context (`/library`)
- **Content Type**: Knowledge base collection
- **Item Format**: Icon, document title, category, date
- **Primary Action**: "Browse Library"
- **Use Case**: Access to knowledge resources

### 4. Images Context (`/images`)
- **Content Type**: Image history
- **Item Format**: Thumbnail, image title, date
- **Primary Action**: "Create Image"
- **Use Case**: Browse previously generated images

## Implementation Details

### Component Structure

1. **MobileSidebar Component**
   - Receives `isOpen` and `onClose` props
   - Accesses current application context via `useNavigationStore`
   - Renders different content based on `activePath`
   - Contains specialized rendering functions for each context

2. **AppLayout Component**
   - Manages sidebar visibility state
   - Passes toggle function to Header
   - Conditionally renders MobileSidebar based on mobile view state

### State Management

- **Navigation Store** (Zustand)
  - Tracks `activePath` to determine current context
  - Manages `isMobileView` state for responsive behavior
  - Provides navigation-related actions

### Interaction Flow

1. User taps app logo in header
2. `MobileSidebar` opens with context-specific content
3. Content is determined by checking `activePath` in the navigation store
4. User can interact with context-specific items or take primary action
5. Sidebar closes after selection or when backdrop is tapped

## UI Components

### Common Elements (All Contexts)

- **Header**: App logo, title, close button
- **Primary Action Button**: Context-specific action
- **Content Area**: Scrollable list of context-specific items

### Context-Specific Elements

- **Home**: List items with icon, title, subtitle
- **Chat**: Conversation items with icon, title, date
- **Library**: Knowledge items with icon, title, category, date
- **Images**: Image items with thumbnail, title, date

## Responsive Behavior

- Sidebar appears as a slide-out overlay on mobile devices
- Full-width up to a maximum of `max-w-xs`
- Semi-transparent backdrop for focus
- Smooth animations for opening/closing

## Technical Implementation

The implementation uses:
- React functional components with hooks
- Zustand for state management
- Tailwind CSS for styling
- Lucide React for icons
- TypeScript for type safety

## Future Enhancements

Potential improvements to consider:
- Swipe gestures for opening/closing sidebar
- Context-specific search within sidebar
- Filtering options for each context
- Drag-and-drop reordering of items
- Pinned/favorite items section
