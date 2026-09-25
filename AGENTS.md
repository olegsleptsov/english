# Agent Notes Draft

These notes are a working draft for future agent instructions. Treat them as project-local guidance unless a user request says otherwise.

## Baseline

- The app is frontend-only: React, TypeScript, Vite.
- The architecture style is Feature-Sliced Design.
- UI work is mobile first. Design, implement, and test the mobile layout before expanding to desktop.
- Avoid adding a backend, server runtime, database, or network API layer unless explicitly requested.
- Use `localStorage` as a temporary persistence backend only through isolated adapters. Do not access it directly from UI components.
- Design future data calls as async request-like contracts so replacing `localStorage` with a real backend later is straightforward.

## Code Principles

- Keep FSD public APIs explicit with `index.ts` files.
- Keep feature logic inside `features/*`; keep reusable helpers in `shared/*`.
- Prefer small pure functions for domain behavior and test them directly.
- Keep UI components focused on rendering and user interactions.
- Do not introduce broad abstractions until duplication or cross-layer boundaries make them useful.

## UI Principles

- Mobile is the primary target. Start with small screens and add desktop refinements with media queries.
- Keep navigation reachable and readable on narrow screens.
- Do not let text overflow controls, tabs, cards, or lesson layouts.
- Desktop layouts should enhance the mobile structure instead of becoming a separate experience.

## Testing Principles

- Tests are part of the definition of done.
- Add unit tests for pure functions and business rules.
- Add RTL user-flow tests for the main positive scenarios. In this frontend-only app, these tests act as our e2e-like checks.
- Avoid testing implementation details when user-visible behavior can be asserted instead.
- Keep test helpers in `shared/lib/testing`.
