import { localStorageClient } from '@/shared/api/local-storage-client';

import type {
  LessonAnalytics,
  LessonAnalyticsStorage,
  LessonAnswerResult,
  LessonVerbAnalytics,
} from '../model/types';

const LESSON_ANALYTICS_STORAGE_KEY = 'polyglot.lessonAnalytics.v1';

export type RecordLessonAnswerRequest = {
  lessonId: number;
  taskId: string;
  verbId?: string;
  result: LessonAnswerResult;
  occurredAt?: string;
};

export const lessonAnalyticsApi = {
  async getAnalytics(): Promise<LessonAnalyticsStorage> {
    return readAnalyticsStorage();
  },

  async getLessonAnalytics(
    lessonId: number,
  ): Promise<LessonAnalytics | undefined> {
    const storage = await readAnalyticsStorage();

    return storage.lessons[String(lessonId)];
  },

  async recordLessonAnswer({
    lessonId,
    taskId,
    verbId,
    result,
    occurredAt = new Date().toISOString(),
  }: RecordLessonAnswerRequest): Promise<LessonAnalytics> {
    const storage = await readAnalyticsStorage();
    const lessonKey = String(lessonId);
    const date = formatLocalDate(occurredAt);
    const lessonAnalytics =
      storage.lessons[lessonKey] ?? createEmptyLessonAnalytics(lessonId);
    const dailyStats =
      lessonAnalytics.daily[date] ?? createEmptyDailyStats(date);
    const taskStats =
      lessonAnalytics.tasks[taskId] ??
      createEmptyTaskAnalytics({ taskId, verbId });

    dailyStats[result] += 1;

    if (verbId) {
      const verbStats = getVerbAnalytics({
        occurredAt,
        verbId,
        verbStats: lessonAnalytics.verbs[verbId],
      });
      const verbDailyStats =
        verbStats.daily[date] ?? createEmptyVerbDailyStats(date);

      verbStats[result] += 1;
      verbStats.shownCount += 1;
      verbStats.lastAnsweredAt = occurredAt;
      verbDailyStats[result] += 1;
      verbDailyStats.shownCount += 1;
      verbStats.daily[date] = verbDailyStats;
      lessonAnalytics.verbs[verbId] = verbStats;
    }

    taskStats[result] += 1;
    taskStats.shownCount += 1;
    lessonAnalytics.totals[result] += 1;
    lessonAnalytics.daily[date] = dailyStats;
    lessonAnalytics.tasks[taskId] = taskStats;
    lessonAnalytics.updatedAt = occurredAt;
    storage.lessons[lessonKey] = lessonAnalytics;

    await localStorageClient.setJson(LESSON_ANALYTICS_STORAGE_KEY, storage);

    return lessonAnalytics;
  },
};

async function readAnalyticsStorage(): Promise<LessonAnalyticsStorage> {
  const storage = await localStorageClient.getJson<LessonAnalyticsStorage>(
    LESSON_ANALYTICS_STORAGE_KEY,
    createEmptyAnalyticsStorage(),
  );

  if (storage.version !== 1 || typeof storage.lessons !== 'object') {
    return createEmptyAnalyticsStorage();
  }

  return storage;
}

function createEmptyAnalyticsStorage(): LessonAnalyticsStorage {
  return {
    version: 1,
    lessons: {},
  };
}

function createEmptyLessonAnalytics(lessonId: number): LessonAnalytics {
  return {
    lessonId,
    daily: {},
    verbs: {},
    tasks: {},
    totals: {
      correct: 0,
      incorrect: 0,
    },
    updatedAt: new Date().toISOString(),
  };
}

function createEmptyDailyStats(date: string) {
  return {
    date,
    correct: 0,
    incorrect: 0,
  };
}

function createEmptyVerbAnalytics({
  occurredAt,
  verbId,
}: {
  occurredAt: string;
  verbId: string;
}): LessonVerbAnalytics {
  return {
    verbId,
    shownCount: 0,
    correct: 0,
    incorrect: 0,
    daily: {},
    lastAnsweredAt: occurredAt,
  };
}

function getVerbAnalytics({
  occurredAt,
  verbId,
  verbStats,
}: {
  occurredAt: string;
  verbId: string;
  verbStats: LessonVerbAnalytics | undefined;
}) {
  if (!verbStats) {
    return createEmptyVerbAnalytics({ occurredAt, verbId });
  }

  return {
    ...verbStats,
    daily: verbStats.daily ?? {},
    lastAnsweredAt: verbStats.lastAnsweredAt ?? occurredAt,
  };
}

function createEmptyVerbDailyStats(date: string) {
  return {
    date,
    shownCount: 0,
    correct: 0,
    incorrect: 0,
  };
}

function createEmptyTaskAnalytics({
  taskId,
  verbId,
}: {
  taskId: string;
  verbId?: string;
}) {
  return {
    taskId,
    ...(verbId ? { verbId } : {}),
    shownCount: 0,
    correct: 0,
    incorrect: 0,
  };
}

function formatLocalDate(value: string) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
