# Architecture Draft

## Feature-Sliced Design

Use FSD as the default structure:

- `app` - app bootstrap, providers, styles, routing setup.
- `pages` - route-level screens that compose widgets and features.
- `widgets` - larger page sections assembled from features and entities.
- `features` - user actions and interaction logic.
- `entities` - business entities, types, and entity-specific logic.
- `shared` - framework-agnostic utilities, reusable UI, config, API adapters, test helpers.

## Import Rules

- A layer may import only from layers below it.
- Prefer imports from slice public APIs (`index.ts`) instead of deep internal paths.
- Keep cross-slice coupling low. If two slices need the same helper, move the helper to `shared`.

## Current Scope

This is an only-frontend app. Do not add backend code. Persistence will initially use `localStorage` behind request-like adapters.

## Mobile First

- Treat mobile as the primary product surface.
- Build base styles for narrow screens first, then use wider breakpoints for desktop enhancements.
- Keep routes and navigation usable without relying on hover, large screens, or dense desktop-only layouts.
