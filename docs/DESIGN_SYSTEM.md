# ChatGPT UI Design System Specification

## 1. Color Palette

### Base Colors

#### Light Mode
| Element | CSS Variable | HEX Value | HSL Value |
|---------|-------------|-----------|-----------|
| Background | --background | #F8F8F8 | hsl(0 0% 97%) |
| Foreground | --foreground | #0A192D | hsl(214 63% 10%) |

#### Dark Mode
| Element | CSS Variable | HEX Value | HSL Value |
|---------|-------------|-----------|-----------|
| Background | --background | #0A192D | hsl(214 64% 11%) |
| Foreground | --foreground | #F8F8F8 | hsl(0 0% 97%) |

### Primary Colors

#### Light Mode
| Element | CSS Variable | HEX Value | HSL Value |
|---------|-------------|-----------|-----------|
| Primary | --primary | #0A192D | hsl(214 64% 11%) |
| Primary Foreground | --primary-foreground | #F8F8F8 | hsl(0 0% 97%) |

#### Dark Mode
| Element | CSS Variable | HEX Value | HSL Value |
|---------|-------------|-----------|-----------|
| Primary | --primary | #4D9FFF | hsl(213 100% 65%) |
| Primary Foreground | --primary-foreground | #0A192D | hsl(214 64% 11%) |

### Accent Colors

| Element | CSS Variable | HEX Value | HSL Value |
|---------|-------------|-----------|-----------|
| Secondary | --secondary | #FFDD00 | hsl(52 100% 50%) |
| Secondary Foreground | --secondary-foreground | #0A192D | hsl(214 64% 11%) |
| Accent | --accent | #00A3A3 | hsl(180 100% 32%) |
| Accent Foreground | --accent-foreground | varies by mode | varies by mode |
| Destructive | --destructive | #FF4D4D | hsl(0 100% 65%) |
| Destructive Foreground | --destructive-foreground | varies by mode | varies by mode |

### Neutral Colors

#### Light Mode
| Element | CSS Variable | HEX Value | HSL Value |
|---------|-------------|-----------|-----------|
| Muted | --muted | #CCCCCC | hsl(0 0% 80%) |
| Muted Foreground | --muted-foreground | #0A192D | hsl(214 64% 11%) |
| Border | --border | #CCCCCC | hsl(0 0% 80%) |
| Input | --input | #CCCCCC | hsl(0 0% 80%) |
| Ring | --ring | #0A192D | hsl(214 64% 11%) |

#### Dark Mode
| Element | CSS Variable | HEX Value | HSL Value |
|---------|-------------|-----------|-----------|
| Muted | --muted | #333333 | hsl(0 0% 20%) |
| Muted Foreground | --muted-foreground | #CCCCCC | hsl(0 0% 80%) |
| Border | --border | #333333 | hsl(0 0% 20%) |
| Input | --input | #333333 | hsl(0 0% 20%) |
| Ring | --ring | #4D9FFF | hsl(213 100% 65%) |

### Component-Specific Colors

#### Sidebar (Light Mode)
| Element | CSS Variable | HEX Value | HSL Value |
|---------|-------------|-----------|-----------|
| Background | --sidebar-background | #F8F8F8 | hsl(0 0% 97%) |
| Foreground | --sidebar-foreground | #0A192D | hsl(214 63% 10%) |
| Accent | --sidebar-accent | #F2F2F2 | hsl(0 0% 95%) |
| Border | --sidebar-border | #E6E6E6 | hsl(0 0% 90%) |

#### Sidebar (Dark Mode)
| Element | CSS Variable | HEX Value | HSL Value |
|---------|-------------|-----------|-----------|
| Background | --sidebar-background | #0F2440 | hsl(214 64% 15%) |
| Foreground | --sidebar-foreground | #F8F8F8 | hsl(0 0% 97%) |
| Accent | --sidebar-accent | #132C4D | hsl(214 64% 18%) |
| Border | --sidebar-border | #173459 | hsl(214 64% 20%) |

### Brand Colors
| Color Name | HEX Value | Usage |
|------------|-----------|-------|
| Prometheus Navy | #0A192D | Primary brand color |
| Prometheus Yellow | #FFDD00 | Secondary brand color |
| Prometheus Orange | #FF5500 | Accent/hover states |
| Prometheus Red | #FF4D4D | Destructive actions |
| Prometheus Turquoise | #00A3A3 | Accent color |
| Prometheus Light Blue | #4D9FFF | Primary in dark mode |
| Prometheus Lavender | #9D8DF1 | Accent color |

## 2. Typography

### Font Families
```css
--font-roboto: 'Roboto', sans-serif; /* Main text */
--font-proxima-nova: 'Proxima Nova', sans-serif; /* Headings */
```

### Font Sizes
| Element | Size | Weight | Line Height |
|---------|------|--------|------------|
| Headings (h1) | text-lg (1.125rem) | font-semibold | Default |
| Body text | text-base (1rem) | font-normal | Default |
| Small text | text-sm (0.875rem) | font-normal | Default |
| Extra small text | text-xs (0.75rem) | font-normal | Default |

### Font Weights
| Weight Name | Value |
|-------------|-------|
| Regular | 400 |
| Medium | 500 |
| Semibold | 600 |
| Bold | 700 |

## 3. Spacing System

### Base Spacing
The design uses Tailwind's spacing scale:

| Size | Value | Usage |
|------|-------|-------|
| px | 1px | Borders |
| 0.5 | 0.125rem (2px) | Tiny spacing |
| 1 | 0.25rem (4px) | Very small spacing |
| 2 | 0.5rem (8px) | Small spacing |
| 3 | 0.75rem (12px) | Medium-small spacing |
| 4 | 1rem (16px) | Default spacing (common in padding) |
| 6 | 1.5rem (24px) | Medium spacing |
| 8 | 2rem (32px) | Large spacing |
| 16 | 4rem (64px) | Extra large spacing |

### Component Spacing
| Component | Padding | Margin | Gap |
|-----------|---------|--------|-----|
| Sidebar | p-4 | - | - |
| Chat messages | p-4 | my-6 | - |
| Message bubbles | p-4 | - | - |
| Input area | p-4 | - | - |
| Buttons | px-4 py-3 | - | - |

### Layout Spacing
| Element | Value |
|---------|-------|
| Sidebar width | 280px (desktop) |
| Message indent | ml-8 md:ml-16 (user), mr-8 md:mr-16 (assistant) |
| Content max-width | max-w-3xl mx-auto |

## 4. Component Patterns

### Layout Components

#### Chat Layout
- Two-column layout on desktop (sidebar + main content)
- Single column with slide-out sidebar on mobile
- Full height with flex column structure

```jsx
<div className="chat-layout-container">
  {/* Sidebar */}
  <div className="sidebar-container">...</div>
  
  {/* Main content */}
  <div className="main-content">
    {/* Mobile header */}
    <div className="mobile-header">...</div>
    
    {/* Chat UI */}
    <ChatUI />
  </div>
</div>
```

#### Sidebar
- Fixed width on desktop, slide-out on mobile
- Contains logo, new chat button, chat history, settings
- Sections separated by subtle borders

```jsx
<div className="h-full flex flex-col bg-white dark:bg-prometheus-navy">
  {/* Header with logo */}
  <div className="p-4 flex justify-between items-center border-b">...</div>
  
  {/* New chat button */}
  <div className="p-4">
    <Button className="w-full bg-prometheus-yellow">...</Button>
  </div>
  
  {/* Chat history */}
  <div className="flex-1 overflow-y-auto">...</div>
  
  {/* Settings */}
  <div className="mt-auto border-t p-4">...</div>
</div>
```

### Message Components

#### Message Container
- Alternating background colors for user/assistant
- Rounded corners (border-radius: 0.5rem)
- Subtle animation on appearance

```jsx
<div className={cn(
  "animate-fade-in rounded-lg p-4",
  message.role === 'user' 
    ? 'bg-prometheus-ultraLightGray dark:bg-prometheus-lightNavy ml-8 md:ml-16' 
    : 'bg-white dark:bg-prometheus-navy border border-prometheus-mediumGray/20 dark:border-prometheus-lightNavy mr-8 md:mr-16'
)}>
  {/* Message content */}
</div>
```

#### Message Avatar
- Circular avatar (40x40px)
- User: Blue circle with "U" text
- Assistant: Yellow circle with logo

```jsx
<div className={cn(
  "w-10 h-10 rounded-full overflow-hidden flex-shrink-0",
  message.role === 'assistant' ? 'bg-prometheus-yellow' : 'bg-prometheus-lightBlue dark:bg-prometheus-turquoise'
)}>
  {/* Avatar content */}
</div>
```

#### Input Area
- Fixed at bottom of chat
- Auto-expanding textarea
- Send button positioned absolutely in bottom-right
- Light gray background in light mode, dark navy in dark mode

```jsx
<div className="border-t p-4 bg-white dark:bg-prometheus-navy shadow-lg">
  <form className="flex flex-col max-w-3xl mx-auto">
    <div className="relative">
      <textarea 
        className="w-full p-4 pr-14 resize-none bg-prometheus-ultraLightGray dark:bg-prometheus-lightNavy rounded-xl" 
      />
      <Button 
        className="absolute bottom-2 right-2 h-10 w-10 p-0 rounded-full bg-prometheus-yellow" 
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  </form>
</div>
```

### Button Variants

#### Primary Button
- Yellow background (#FFDD00)
- Navy text (#0A192D)
- Rounded corners (border-radius: 0.5rem)
- Hover: Orange background (#FF5500)

#### Icon Button
- Circular shape
- 40x40px size
- Centered icon

#### Text Button
- No background
- Hover: Light gray background in light mode, slightly lighter navy in dark mode

## 5. Responsive Behavior

### Breakpoints
- Mobile: < 768px
- Desktop: ≥ 768px

### Mobile Adaptations
1. **Sidebar**
   - Hidden by default
   - Slides in from left when toggled
   - Overlay covers main content when open
   - Close button appears in top-right

2. **Header**
   - Mobile-only header appears with hamburger menu
   - Logo and title centered
   - Full width

3. **Messages**
   - Reduced horizontal padding (px-4 vs px-6)
   - Smaller indentation (ml-8/mr-8 vs ml-16/mr-16)

4. **Input Area**
   - Same design but full width
   - Maintains position at bottom of screen

### Desktop Adaptations
1. **Layout**
   - Two-column layout with fixed sidebar
   - No mobile header
   - More generous spacing overall

2. **Content Width**
   - Maximum width for content (max-w-3xl)
   - Centered horizontally

## 6. Animation and Transitions

### Transitions
- Color transitions: 200ms duration
  ```css
  transition-colors duration-200
  ```

### Animations
- Fade-in for messages:
  ```css
  @keyframes fade-in {
    "0%": {
      opacity: "0",
      transform: "translateY(10px)"
    },
    "100%": {
      opacity: "1",
      transform: "translateY(0)"
    }
  }
  ```

- Loading spinner:
  ```css
  animate-spin
  ```

## 7. Accessibility Features

### Color Contrast
- Dark text on light backgrounds
- Light text on dark backgrounds
- Sufficient contrast ratios for readability

### Focus States
- Focus rings on interactive elements
- Keyboard navigation support

### Screen Reader Support
- Proper aria labels on buttons
- SR-only text for icon-only buttons

### Reduced Motion
- Respects user preference for reduced motion

## 8. Implementation Guidelines

### CSS Variables
- Use CSS variables for colors, spacing, and other design tokens
- Implement via Tailwind theme configuration

### Component Structure
- Follow the existing component hierarchy
- Maintain separation of concerns between layout, UI components, and business logic

### Responsive Implementation
- Use mobile-first approach
- Apply responsive classes for desktop (md: prefix)

### Dark Mode
- Implement via CSS variables and Tailwind's dark mode
- Toggle via ThemeProvider component