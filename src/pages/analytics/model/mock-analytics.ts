import type {
  LessonAnalytics,
  LessonAnalyticsStorage,
  LessonAnswerResult,
  LessonTaskAnalytics,
  LessonVerbAnalytics,
} from '@/entities/lesson-analytics';

export const USE_MOCK_ANALYTICS_WHEN_EMPTY = true;

const MOCK_VERB_IDS = [
  'have',
  'do',
  'go',
  'make',
  'know',
  'think',
  'see',
  'come',
  'want',
  'use',
  'find',
  'give',
];

const MOCK_SUBJECTS = ['I', 'you', 'he', 'she', 'we', 'they'];
const MOCK_SENTENCE_TYPES = ['statement', 'question', 'negative'];

export function createMockAnalyticsStorage(
  referenceDate = new Date(),
): LessonAnalyticsStorage {
  const lesson = createEmptyLessonAnalytics(1);

  for (let daysAgo = 13; daysAgo >= 0; daysAgo -= 1) {
    const date = formatDate(addDays(referenceDate, -daysAgo));

    MOCK_VERB_IDS.forEach((verbId, verbIndex) => {
      const attempts = ((verbIndex + daysAgo) % 3) + 1;

      for (let attemptIndex = 0; attemptIndex < attempts; attemptIndex += 1) {
        const subject =
          MOCK_SUBJECTS[(verbIndex + attemptIndex) % MOCK_SUBJECTS.length];
        const sentenceType =
          MOCK_SENTENCE_TYPES[(daysAgo + attemptIndex) % MOCK_SENTENCE_TYPES.length];
        const result = getMockResult({
          attemptIndex,
          daysAgo,
          verbIndex,
        });

        addAttempt({
          lesson,
          occurredAt: `${date}T12:${String(verbIndex + attemptIndex).padStart(
            2,
            '0',
          )}:00.000Z`,
          result,
          taskId: `${verbId}-${subject}-present-${sentenceType}`,
          verbId,
        });
      }
    });
  }

  return {
    version: 1,
    lessons: {
      '1': lesson,
    },
  };
}

function addAttempt({
  lesson,
  occurredAt,
  result,
  taskId,
  verbId,
}: {
  lesson: LessonAnalytics;
  occurredAt: string;
  result: LessonAnswerResult;
  taskId: string;
  verbId: string;
}) {
  const date = formatDate(new Date(occurredAt));
  const daily = lesson.daily[date] ?? {
    date,
    correct: 0,
    incorrect: 0,
  };
  const verb =
    lesson.verbs[verbId] ?? createEmptyVerbAnalytics(verbId, occurredAt);
  const verbDaily = verb.daily[date] ?? {
    date,
    shownCount: 0,
    correct: 0,
    incorrect: 0,
  };
  const task = lesson.tasks[taskId] ?? createEmptyTaskAnalytics(taskId, verbId);

  daily[result] += 1;
  verb[result] += 1;
  verb.shownCount += 1;
  verb.lastAnsweredAt = occurredAt;
  verbDaily[result] += 1;
  verbDaily.shownCount += 1;
  task[result] += 1;
  task.shownCount += 1;
  lesson.totals[result] += 1;
  lesson.updatedAt = occurredAt;
  lesson.daily[date] = daily;
  verb.daily[date] = verbDaily;
  lesson.verbs[verbId] = verb;
  lesson.tasks[taskId] = task;
}

function getMockResult({
  attemptIndex,
  daysAgo,
  verbIndex,
}: {
  attemptIndex: number;
  daysAgo: number;
  verbIndex: number;
}): LessonAnswerResult {
  return (verbIndex + daysAgo + attemptIndex) % 5 === 0
    ? 'incorrect'
    : 'correct';
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

function createEmptyVerbAnalytics(
  verbId: string,
  occurredAt: string,
): LessonVerbAnalytics {
  return {
    verbId,
    shownCount: 0,
    correct: 0,
    incorrect: 0,
    daily: {},
    lastAnsweredAt: occurredAt,
  };
}

function createEmptyTaskAnalytics(
  taskId: string,
  verbId: string,
): LessonTaskAnalytics {
  return {
    taskId,
    verbId,
    shownCount: 0,
    correct: 0,
    incorrect: 0,
  };
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setHours(12, 0, 0, 0);
  nextDate.setDate(nextDate.getDate() + days);

  return nextDate;
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
