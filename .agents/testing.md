# Testing Draft

## Required Test Types

- Unit tests: pure functions, reducers, mappers, validators, and domain rules.
- RTL user-flow tests: main positive scenarios from the user's perspective.

## Expectations

- Every meaningful feature should have at least one user-visible positive scenario test.
- Every non-trivial pure function should have focused unit tests.
- Prefer `@testing-library/react` queries by role, label, and visible text.
- Use `@testing-library/user-event` for user interactions.
- Keep shared render helpers in `src/shared/lib/testing`.

## Local Commands

- `npm run test` runs the test suite.
- `npm run typecheck` catches TypeScript issues.
- `npm run build` checks production build readiness.
