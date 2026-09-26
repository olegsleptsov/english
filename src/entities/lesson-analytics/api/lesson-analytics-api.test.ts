import { beforeEach, describe, expect, it } from 'vitest';

import { lessonAnalyticsApi } from './lesson-analytics-api';

describe('интерфейс аналитики уроков', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('сохраняет дневные правильные и неправильные ответы по уроку', async () => {
    await lessonAnalyticsApi.recordLessonAnswer({
      lessonId: 1,
      taskId: 'have-I-present-statement',
      verbId: 'have',
      result: 'correct',
      occurredAt: '2026-09-25T08:15:00.000Z',
    });
    await lessonAnalyticsApi.recordLessonAnswer({
      lessonId: 1,
      taskId: 'have-I-present-statement',
      verbId: 'have',
      result: 'incorrect',
      occurredAt: '2026-09-25T09:15:00.000Z',
    });

    const analytics = await lessonAnalyticsApi.getLessonAnalytics(1);

    expect(analytics?.daily['2026-09-25']).toMatchObject({
      correct: 1,
      incorrect: 1,
    });
    expect(analytics?.totals).toEqual({
      correct: 1,
      incorrect: 1,
    });
  });

  it('агрегирует статистику по глаголам и заданиям для будущих экранов аналитики', async () => {
    await lessonAnalyticsApi.recordLessonAnswer({
      lessonId: 1,
      taskId: 'have-I-present-statement',
      verbId: 'have',
      result: 'correct',
      occurredAt: '2026-09-25T08:15:00.000Z',
    });
    await lessonAnalyticsApi.recordLessonAnswer({
      lessonId: 1,
      taskId: 'have-you-present-statement',
      verbId: 'have',
      result: 'correct',
      occurredAt: '2026-09-25T09:15:00.000Z',
    });
    await lessonAnalyticsApi.recordLessonAnswer({
      lessonId: 1,
      taskId: 'use-I-present-statement',
      verbId: 'use',
      result: 'incorrect',
      occurredAt: '2026-09-25T10:15:00.000Z',
    });

    const analytics = await lessonAnalyticsApi.getLessonAnalytics(1);

    expect(analytics?.verbs.have).toMatchObject({
      shownCount: 2,
      correct: 2,
      incorrect: 0,
      daily: {
        '2026-09-25': {
          date: '2026-09-25',
          shownCount: 2,
          correct: 2,
          incorrect: 0,
        },
      },
      lastAnsweredAt: '2026-09-25T09:15:00.000Z',
    });
    expect(analytics?.verbs.use).toMatchObject({
      shownCount: 1,
      correct: 0,
      incorrect: 1,
      daily: {
        '2026-09-25': {
          date: '2026-09-25',
          shownCount: 1,
          correct: 0,
          incorrect: 1,
        },
      },
      lastAnsweredAt: '2026-09-25T10:15:00.000Z',
    });
    expect(analytics?.tasks['have-I-present-statement']).toMatchObject({
      verbId: 'have',
      shownCount: 1,
      correct: 1,
      incorrect: 0,
    });
  });
});
