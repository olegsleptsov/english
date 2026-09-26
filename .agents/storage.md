# Storage Draft

## Temporary Backend

The application is frontend-only. `localStorage` is the temporary persistence layer and should be treated as a backend replacement, not as UI state.

## Rules

- Do not call `localStorage` directly from components.
- Put storage access behind adapters in `shared/api` or another agreed infrastructure location.
- Use async functions for storage operations to mimic request behavior.
- Keep serialization, parsing, migrations, and versioning inside the adapter boundary.
- Return typed DTOs or mapped domain objects instead of raw storage strings.

## Lesson Analytics

Lesson trainer analytics are stored through `lessonAnalyticsApi`, not directly from UI code.

Current localStorage key: `polyglot.lessonAnalytics.v1`.

The stored value is versioned and grouped by lesson:

- `lessons[lessonId].daily[YYYY-MM-DD]`: daily `correct` and `incorrect` answer counts.
- `lessons[lessonId].verbs[verbId]`: per-verb `shownCount`, `correct`, `incorrect`, `lastAnsweredAt`, and `daily[YYYY-MM-DD]` counts.
- `lessons[lessonId].tasks[taskId]`: per-task `shownCount`, `correct`, and `incorrect` counts.
- `lessons[lessonId].totals`: lesson-level aggregate answer counts.

When adding lesson 2+ trainers, record answer submissions through the same API with the current `lessonId`, stable `taskId`, and optional `verbId` when the task is verb-based.

Manual verb learning status and automatic mastery are separate concepts. Manual status is stored by the verb API. Automatic mastery is calculated from lesson analytics thresholds, including total correct answers, minimum attempts, minimum accuracy, and per-construction coverage. Do not delete or rewrite analytics when either status changes.

The analytics page must read data through `lessonAnalyticsApi`. During draft development, empty analytics can be visualized with demo data controlled by `USE_MOCK_ANALYTICS_WHEN_EMPTY` in `src/pages/analytics/model/mock-analytics.ts`; keep this toggle easy to remove or disable.

## Future Migration

The storage boundary should make it possible to replace `localStorage` with a real backend and database without rewriting UI components or feature logic.
