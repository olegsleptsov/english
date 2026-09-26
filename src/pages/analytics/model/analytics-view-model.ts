import type {
  LessonAnalyticsStorage,
  LessonTaskAnalytics,
  LessonVerbAnalytics,
} from '@/entities/lesson-analytics';
import { COMMON_ENGLISH_VERBS } from '@/entities/verb';

type DailyPoint = {
  date: string;
  label: string;
  correct: number;
  incorrect: number;
  total: number;
  correctPercent: number;
  incorrectPercent: number;
};

type LessonSummary = {
  lessonId: number;
  title: string;
  correct: number;
  incorrect: number;
  total: number;
  accuracy: number;
};

type VerbRow = {
  verbId: string;
  label: string;
  translation: string;
  shownCount: number;
  correct: number;
  incorrect: number;
  accuracy: number;
  lastAnsweredAt: string;
};

type TaskRow = {
  lessonId: number;
  taskId: string;
  label: string;
  shownCount: number;
  correct: number;
  incorrect: number;
};

export type AnalyticsViewModel = {
  totalAnswers: number;
  totalCorrect: number;
  totalIncorrect: number;
  accuracy: number;
  dailyPoints: DailyPoint[];
  lessonSummaries: LessonSummary[];
  verbRows: VerbRow[];
  problemVerbRows: VerbRow[];
  frequentTaskRows: TaskRow[];
};

const DISPLAYED_DAYS = 14;
const DISPLAYED_ROWS = 8;
const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'short',
});

export function hasAnalyticsData(storage: LessonAnalyticsStorage) {
  return Object.values(storage.lessons).some(
    (lesson) => lesson.totals.correct + lesson.totals.incorrect > 0,
  );
}

export function createAnalyticsViewModel(
  storage: LessonAnalyticsStorage,
): AnalyticsViewModel {
  const dailyMap = new Map<string, { correct: number; incorrect: number }>();
  const verbMap = new Map<string, LessonVerbAnalytics>();
  const taskRows: TaskRow[] = [];
  const lessons = Object.values(storage.lessons).sort(
    (firstLesson, secondLesson) => firstLesson.lessonId - secondLesson.lessonId,
  );

  let totalCorrect = 0;
  let totalIncorrect = 0;

  lessons.forEach((lesson) => {
    totalCorrect += lesson.totals.correct;
    totalIncorrect += lesson.totals.incorrect;

    Object.values(lesson.daily).forEach((daily) => {
      const storedDaily = dailyMap.get(daily.date) ?? {
        correct: 0,
        incorrect: 0,
      };

      storedDaily.correct += daily.correct;
      storedDaily.incorrect += daily.incorrect;
      dailyMap.set(daily.date, storedDaily);
    });

    Object.values(lesson.verbs).forEach((verb) => {
      verbMap.set(verb.verbId, mergeVerbStats(verbMap.get(verb.verbId), verb));
    });

    Object.values(lesson.tasks).forEach((task) => {
      taskRows.push(createTaskRow(lesson.lessonId, task));
    });
  });

  const totalAnswers = totalCorrect + totalIncorrect;
  const dailyPoints = Array.from(dailyMap.entries())
    .sort(([firstDate], [secondDate]) => firstDate.localeCompare(secondDate))
    .slice(-DISPLAYED_DAYS)
    .map(([date, daily]) => {
      const total = daily.correct + daily.incorrect;

      return {
        date,
        label: formatChartDate(date),
        correct: daily.correct,
        incorrect: daily.incorrect,
        total,
        correctPercent: getPercent(daily.correct, total),
        incorrectPercent: getPercent(daily.incorrect, total),
      };
    });

  const lessonSummaries = lessons.map((lesson) => {
    const total = lesson.totals.correct + lesson.totals.incorrect;

    return {
      lessonId: lesson.lessonId,
      title: `Lesson ${lesson.lessonId}`,
      correct: lesson.totals.correct,
      incorrect: lesson.totals.incorrect,
      total,
      accuracy: getPercent(lesson.totals.correct, total),
    };
  });

  const verbRows = Array.from(verbMap.values())
    .map(createVerbRow)
    .sort(
      (firstVerb, secondVerb) =>
        secondVerb.shownCount - firstVerb.shownCount ||
        secondVerb.incorrect - firstVerb.incorrect,
    );
  const problemVerbRows = verbRows
    .filter((verb) => verb.incorrect > 0)
    .sort(
      (firstVerb, secondVerb) =>
        secondVerb.incorrect - firstVerb.incorrect ||
        firstVerb.accuracy - secondVerb.accuracy,
    )
    .slice(0, DISPLAYED_ROWS);
  const frequentTaskRows = taskRows
    .sort(
      (firstTask, secondTask) =>
        secondTask.shownCount - firstTask.shownCount ||
        secondTask.incorrect - firstTask.incorrect,
    )
    .slice(0, DISPLAYED_ROWS);

  return {
    totalAnswers,
    totalCorrect,
    totalIncorrect,
    accuracy: getPercent(totalCorrect, totalAnswers),
    dailyPoints,
    lessonSummaries,
    verbRows: verbRows.slice(0, DISPLAYED_ROWS),
    problemVerbRows,
    frequentTaskRows,
  };
}

function mergeVerbStats(
  currentStats: LessonVerbAnalytics | undefined,
  nextStats: LessonVerbAnalytics,
): LessonVerbAnalytics {
  if (!currentStats) {
    return {
      ...nextStats,
      daily: { ...nextStats.daily },
    };
  }

  return {
    ...currentStats,
    shownCount: currentStats.shownCount + nextStats.shownCount,
    correct: currentStats.correct + nextStats.correct,
    incorrect: currentStats.incorrect + nextStats.incorrect,
    lastAnsweredAt:
      currentStats.lastAnsweredAt > nextStats.lastAnsweredAt
        ? currentStats.lastAnsweredAt
        : nextStats.lastAnsweredAt,
    daily: mergeVerbDailyStats(currentStats, nextStats),
  };
}

function mergeVerbDailyStats(
  currentStats: LessonVerbAnalytics,
  nextStats: LessonVerbAnalytics,
) {
  const mergedDaily = { ...currentStats.daily };

  Object.values(nextStats.daily).forEach((dailyStats) => {
    const storedDaily = mergedDaily[dailyStats.date] ?? {
      date: dailyStats.date,
      shownCount: 0,
      correct: 0,
      incorrect: 0,
    };

    storedDaily.shownCount += dailyStats.shownCount;
    storedDaily.correct += dailyStats.correct;
    storedDaily.incorrect += dailyStats.incorrect;
    mergedDaily[dailyStats.date] = storedDaily;
  });

  return mergedDaily;
}

function createVerbRow(verb: LessonVerbAnalytics): VerbRow {
  const dictionaryVerb = COMMON_ENGLISH_VERBS.find(
    (item) => item.id === verb.verbId,
  );

  return {
    verbId: verb.verbId,
    label: dictionaryVerb?.base ?? verb.verbId,
    translation: dictionaryVerb?.russian.infinitive ?? 'без перевода',
    shownCount: verb.shownCount,
    correct: verb.correct,
    incorrect: verb.incorrect,
    accuracy: getPercent(verb.correct, verb.correct + verb.incorrect),
    lastAnsweredAt: verb.lastAnsweredAt,
  };
}

function createTaskRow(
  lessonId: number,
  task: LessonTaskAnalytics,
): TaskRow {
  return {
    lessonId,
    taskId: task.taskId,
    label: formatTaskLabel(task.taskId),
    shownCount: task.shownCount,
    correct: task.correct,
    incorrect: task.incorrect,
  };
}

function formatTaskLabel(taskId: string) {
  const [rawVerb = taskId, rawSubject = '', , rawType = ''] = taskId.split('-');
  const subject = rawSubject ? rawSubject.toLowerCase() : '';
  const sentenceTypeLabels: Record<string, string> = {
    negative: 'отрицание',
    question: 'вопрос',
    statement: 'утверждение',
  };
  const typeLabel = sentenceTypeLabels[rawType] ?? rawType;

  return [rawVerb, subject, typeLabel].filter(Boolean).join(' · ');
}

function formatChartDate(date: string) {
  return dateFormatter.format(new Date(`${date}T12:00:00`));
}

function getPercent(value: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}
