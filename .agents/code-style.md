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

## FSD Hygiene

- Preserve layer boundaries.
- Add public `index.ts` files for reusable slices.
- Do not move code across layers without a clear ownership reason.
