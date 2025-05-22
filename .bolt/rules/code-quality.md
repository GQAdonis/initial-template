# Code Quality Guidelines for Prometheus Bolt.diy Template

This document outlines the code quality standards and best practices for applications generated using the Prometheus Bolt.diy template. Adhering to these guidelines ensures maintainable, scalable, and high-quality code across all generated projects.

## TypeScript Guidelines

### Type Safety

1. **No `any` Type**
   - Never use the `any` type explicitly or implicitly
   - Always provide proper type annotations for variables, function parameters, and return types
   - Use `unknown` instead of `any` when the type is truly unknown
   - Leverage TypeScript's utility types (`Partial<T>`, `Required<T>`, `Pick<T>`, etc.) when appropriate

2. **Strict Null Checking**
   - Enable `strictNullChecks` in TypeScript configuration
   - Always handle potential null or undefined values
   - Use optional chaining (`?.`) and nullish coalescing (`??`) operators appropriately

3. **Type Definitions**
   - Create dedicated type definition files (`*.d.ts`) for external libraries and global types
   - Use interfaces for object shapes that could be implemented and types for unions, intersections, and primitives
   - Document complex types with JSDoc comments

### Component Structure

1. **Component-Store Interaction**
   - Components must never talk directly to stores
   - Create custom hooks that interact with stores and expose only what components need
   - Example:
     ```typescript
     // ❌ Don't do this
     function MyComponent() {
       const { user, updateUser } = useUserStore();
       // ...
     }

     // ✅ Do this instead
     function useUserManager() {
       const { user, updateUser } = useUserStore();
       const handleUpdateProfile = useCallback((profile) => {
         updateUser({ ...user, ...profile });
       }, [user, updateUser]);
       
       return { user, updateProfile: handleUpdateProfile };
     }

     function MyComponent() {
       const { user, updateProfile } = useUserManager();
       // ...
     }
     ```

2. **Props Typing**
   - All component props must be explicitly typed
   - Use interface extension for common prop patterns
   - Document each prop with JSDoc comments

3. **Component Organization**
   - Keep components focused on a single responsibility
   - Extract complex logic into custom hooks
   - Separate UI, business logic, and data access concerns

## Rust Guidelines

### Code Structure and Length

1. **Function Length**
   - Keep functions between 10 and 30 lines of code
   - Split complex functions into smaller, well-named functions
   - Each function should focus on a single responsibility

2. **Error Handling**
   - Avoid using `unwrap()` and `expect()` in production code
   - Use proper error handling with `Result` and `Option` types
   - Propagate errors using the `?` operator
   - Create custom error types for complex applications
   - Example:
     ```rust
     // ❌ Don't do this
     fn process_data(input: &str) -> String {
         let data = parse_input(input).unwrap();
         let result = transform_data(data).unwrap();
         result
     }

     // ✅ Do this instead
     fn process_data(input: &str) -> Result<String, AppError> {
         let data = parse_input(input)?;
         let result = transform_data(data)?;
         Ok(result)
     }
     ```

3. **Type Conversion**
   - Use `.into()` only for clear and explicit type conversions
   - Document non-obvious conversions
   - Example:
     ```rust
     // ❌ Don't do this
     let value = get_data().into();
     
     // ✅ Do this instead
     // Convert NetworkResponse to AppData
     let value: AppData = get_data().into();
     ```

4. **Code Simplicity**
   - Favor simpler code over complex, clever solutions
   - Comments should explain "why" not "what" the code does
   - Prioritize readability over excessive optimization

### Memory Management

1. **Ownership and Borrowing**
   - Follow Rust's ownership rules carefully
   - Use references when ownership transfer is not needed
   - Document lifetime parameters clearly

2. **Smart Pointers**
   - Use `Arc<T>` for shared ownership across threads
   - Use `Rc<T>` for shared ownership within a single thread
   - Use `Box<T>` when you need heap allocation with single ownership

3. **Minimize Unsafe Code**
   - Avoid `unsafe` blocks whenever possible
   - When using `unsafe`, document the invariants being maintained
   - Encapsulate unsafe code behind safe interfaces

## UI/UX Guidelines

1. **Responsive Design**
   - All UI components must be responsive across different screen sizes
   - Test layouts on various device sizes
   - Use relative units (rem, %, etc.) instead of fixed pixels

2. **Accessibility**
   - Ensure proper contrast ratios for text and background
   - Add appropriate ARIA attributes
   - Ensure keyboard navigability
   - Support screen readers with proper semantic HTML

3. **Performance**
   - Optimize component re-renders
   - Lazy load components when appropriate
   - Use memoization techniques (`useMemo`, `useCallback`) for expensive computations
   - Avoid layout thrashing

4. **Animation Guidelines**
   - Animations should be purposeful, not decorative
   - Respect user preferences for reduced motion
   - Keep animations under 300ms for UI interactions
   - Use hardware-accelerated properties when possible

## Testing Standards

1. **Unit Tests**
   - Each component and utility function should have unit tests
   - Test both success and failure paths
   - Mock external dependencies

2. **Integration Tests**
   - Test component interactions
   - Verify store integrations
   - Test routing and navigation flows

3. **End-to-End Tests**
   - Create critical user journey tests
   - Test on multiple browsers and devices

## Documentation Requirements

1. **Code Comments**
   - Use JSDoc for TypeScript/JavaScript code
   - Use rustdoc for Rust code
   - Document complex algorithms and business rules
   - Avoid redundant comments that just repeat what the code does

2. **README Files**
   - Each project should have a comprehensive README
   - Include setup instructions
   - Document available scripts
   - Provide architecture overview

3. **Architecture Documentation**
   - Document system architecture and component relationships
   - Include diagrams for complex systems
   - Explain key design decisions and trade-offs

## Commit and Version Control

1. **Commit Messages**
   - Use conventional commit format (`type(scope): subject`)
   - Write descriptive commit messages
   - Reference issue numbers when applicable

2. **Branch Strategy**
   - Use feature branches for new features
   - Use fix branches for bug fixes
   - Squash commits when merging to main branch

## Performance and Optimization

1. **Bundle Size**
   - Monitor bundle size regularly
   - Split code into chunks for better loading
   - Tree-shake unused code

2. **Runtime Performance**
   - Profile and optimize hot paths
   - Minimize work in render functions
   - Use web workers for CPU-intensive tasks

3. **Memory Management**
   - Clean up event listeners and subscriptions
   - Avoid memory leaks in long-lived applications
   - Use appropriate data structures for the task
