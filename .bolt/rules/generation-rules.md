# Prometheus Bolt.diy Generation Rules

This document outlines the comprehensive rules and guidelines for code generation using the Prometheus template with bolt.diy. These rules are derived from the project's `.clinerules` and `.winsurfrules` configurations to ensure consistent, high-quality code across all generated applications.

## Project Structure

### Monorepo Architecture

All applications in this template follow a monorepo architecture where:

1. Code is shared between Mobile, Desktop, and Web applications
2. Mobile and Desktop applications use Tauri
3. Web applications use React/Vite
4. All backend code is written in Rust

### File Length Limits

Never generate a file with more than 500 lines of code. Break the logic and abstraction up into consumable chunks if longer than that. This ensures:

- Better maintainability
- Easier code reviews
- Improved readability
- Better performance for AI tools when reading or modifying code

## Technology Stack

All applications generated with this template must use:

1. React 19
2. Vite 6
3. Zustand for state management
4. Zod for validation
5. Shadcn-UI for user interface components
6. CoPilotKit for AI integration

## TypeScript Rules

1. No use of `any` type explicitly or implicitly
2. Strongly typed properties and function parameters only
3. Components must never talk directly to stores—only to hooks that set up and talk to the stores on their behalf

## Rust Language Rules

1. Follow all Rust best practices
2. Keep code short and concise—between 10 and 30 lines max per function
3. Use `into()` and `unwrap()` thoughtfully:
   - Avoid using `unwrap()` and `expect()` in production code
   - Prefer explicit error handling using `match`, `if let`, or the `?` operator
   - Ensure `.into()` conversions are explicit and clear
4. Always check for existing types before creating new ones
5. Favor simpler code solutions to avoid Rust's verbosity

## UI/UX Guidelines

1. Always refer to documents in the `docs/*` directory for UI specifications
2. Favor simple, elegant, flat interfaces with:
   - No borders
   - Subtle shading for selection indicators
   - Background color changes for state differentiation
3. Every view must have both mobile and desktop versions
4. Include meaningful animations where appropriate to:
   - Show direction of movement
   - Ensure proper focus
   - Illustrate relationships between on-screen elements

## Architectural Patterns

1. Use CLEAN architecture wherever possible
2. Organize code into recognizable patterns for better developer and AI comprehension
3. Ensure separation of concerns between:
   - UI components
   - Business logic
   - Data management
   - API integration

## Code Generation Process

When generating code:

1. Always validate with context7 MCP server when available
2. Use web search for validation when context7 is unavailable
3. Track the number of passes needed to solve problems
4. Refactor if a problem takes more than 3 passes to fix
5. Generate comprehensive documentation inline with code

## AI-Friendly Guidelines

1. Prioritize simplicity and clarity over cleverness
2. Use comprehensive and standard error handling
3. Leverage type annotations explicitly
4. Structure code with standard layouts
5. Minimize `unsafe` code and manual memory management
6. Include thorough comments and docstrings
7. Ensure code is lint- and format-clean
8. Prefer stable, well-documented features and APIs
9. Include tests and examples
10. Break problems into clear subproblems

## Cross-Platform Considerations

1. All UI components must be responsive and work across:
   - Desktop (Windows, macOS, Linux)
   - Mobile (iOS, Android)
   - Web browsers
2. Use platform detection utilities to provide platform-specific behaviors
3. Ensure touch targets are appropriately sized for mobile
4. Test all interfaces in both light and dark modes

## Documentation Standards

1. Include comprehensive JSDoc/TSDoc comments for all functions, methods, and classes
2. Document complex algorithms with explanations of the approach
3. Add usage examples for API functions
4. Maintain a clear project README with setup and development instructions
