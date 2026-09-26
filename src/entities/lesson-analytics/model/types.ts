export type LessonAnswerResult = 'correct' | 'incorrect';

export type LessonAnswerDailyStats = {
  date: string;
  correct: number;
  incorrect: number;
};

export type LessonVerbDailyStats = {
  date: string;
  shownCount: number;
  correct: number;
  incorrect: number;
};

export type LessonVerbAnalytics = {
  verbId: string;
  shownCount: number;
  correct: number;
  incorrect: number;
  daily: Record<string, LessonVerbDailyStats>;
  lastAnsweredAt: string;
};

export type LessonTaskAnalytics = {
  taskId: string;
  verbId?: string;
  shownCount: number;
  correct: number;
  incorrect: number;
};

export type LessonAnalytics = {
  lessonId: number;
  daily: Record<string, LessonAnswerDailyStats>;
  verbs: Record<string, LessonVerbAnalytics>;
  tasks: Record<string, LessonTaskAnalytics>;
  totals: {
    correct: number;
    incorrect: number;
  };
  updatedAt: string;
};

export type LessonAnalyticsStorage = {
  version: 1;
  lessons: Record<string, LessonAnalytics>;
};
