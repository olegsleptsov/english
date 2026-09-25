# Code Style Draft

## TypeScript

- Use strict TypeScript.
- Prefer explicit types at module boundaries.
- Avoid `any` unless the unknown shape is being intentionally narrowed.
- Keep pure logic separated from React rendering where practical.

## React

- Use function components.
- Keep components small and named by their role.
- Keep side effects close to the boundary that owns them.
- Avoid direct persistence, timers, or browser API calls in presentational components.

## Layout

- Write CSS mobile first: base rules target small screens, media queries enhance wider screens.
- Validate that navigation, buttons, headings, and content blocks fit at 320px width.
- Prefer resilient layout primitives such as grid, flex, minmax, min-width: 0, and overflow handling.
- Do not use viewport-width font scaling for readable app UI.

## FSD Hygiene

- Preserve layer boundaries.
- Add public `index.ts` files for reusable slices.
- Do not move code across layers without a clear ownership reason.
