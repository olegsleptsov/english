# English

Frontend-only React + TypeScript application scaffolded with Vite and Feature-Sliced Design.

## Scripts

- `npm run dev` starts the local development server.
- `npm run build` type-checks and builds the app.
- `npm run test` runs Vitest tests.
- `npm run typecheck` runs TypeScript checks.

## Architecture

The codebase follows FSD layers:

- `app` - application entry, global providers, global styles.
- `pages` - route-level screens.
- `widgets` - composed UI blocks.
- `features` - user-facing actions and interactions.
- `entities` - domain models.
- `shared` - reusable infrastructure, UI primitives, config, testing utilities.

This project is frontend-only. Future data access should be isolated behind adapters that can use `localStorage` now and be replaced by a real backend later.

## UI Direction

The application is developed mobile first. Mobile layouts are the baseline, and desktop layouts should enhance the same flows without changing the product model.
