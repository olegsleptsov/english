# Storage Draft

## Temporary Backend

The application is frontend-only. `localStorage` is the temporary persistence layer and should be treated as a backend replacement, not as UI state.

## Rules

- Do not call `localStorage` directly from components.
- Put storage access behind adapters in `shared/api` or another agreed infrastructure location.
- Use async functions for storage operations to mimic request behavior.
- Keep serialization, parsing, migrations, and versioning inside the adapter boundary.
- Return typed DTOs or mapped domain objects instead of raw storage strings.

## Future Migration

The storage boundary should make it possible to replace `localStorage` with a real backend and database without rewriting UI components or feature logic.
