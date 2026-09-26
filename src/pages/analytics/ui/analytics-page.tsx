import { useEffect, useMemo, useState } from 'react';

import {
  lessonAnalyticsApi,
  type LessonAnalyticsStorage,
} from '@/entities/lesson-analytics';

import {
  createAnalyticsViewModel,
  hasAnalyticsData,
  type AnalyticsViewModel,
} from '../model/analytics-view-model';
import {
  createMockAnalyticsStorage,
  USE_MOCK_ANALYTICS_WHEN_EMPTY,
} from '../model/mock-analytics';

import styles from './analytics-page.module.css';

type AnalyticsState =
  | {
      status: 'loading';
      storage: null;
    }
  | {
      status: 'ready';
      storage: LessonAnalyticsStorage;
    };

export function AnalyticsPage() {
  const [state, setState] = useState<AnalyticsState>({
    status: 'loading',
    storage: null,
  });
  const mockStorage = useMemo(() => createMockAnalyticsStorage(), []);

  useEffect(() => {
    let isActive = true;

    async function loadAnalytics() {
      const storage = await lessonAnalyticsApi.getAnalytics();

      if (isActive) {
        setState({
          status: 'ready',
          storage,
        });
      }
    }

    void loadAnalytics();

    return () => {
      isActive = false;
    };
  }, []);

  if (state.status === 'loading') {
    return (
      <section className={styles.screen} aria-live="polite">
        <h1 className={styles.title}>Analytics</h1>
        <p className={styles.lead}>Загружаем статистику тренировок...</p>
      </section>
    );
  }

  const shouldUseMockData =
    USE_MOCK_ANALYTICS_WHEN_EMPTY && !hasAnalyticsData(state.storage);
  const analyticsStorage = shouldUseMockData ? mockStorage : state.storage;
  const viewModel = createAnalyticsViewModel(analyticsStorage);

  if (!shouldUseMockData && viewModel.totalAnswers === 0) {
    return (
      <section className={styles.screen}>
        <h1 className={styles.title}>Analytics</h1>
        <p className={styles.lead}>
          Здесь появится статистика после первых ответов в тренажере.
        </p>
      </section>
    );
  }

  return (
    <section className={styles.screen} aria-labelledby="analytics-title">
      <div className={styles.hero}>
        <div className={styles.titleBlock}>
          <p className={styles.kicker}>Learning analytics</p>
          <h1 className={styles.title} id="analytics-title">
            Analytics
          </h1>
          <p className={styles.lead}>
            Динамика ответов, точность по глаголам и частотность заданий.
          </p>
        </div>
        {shouldUseMockData ? (
          <span className={styles.demoBadge}>demo data</span>
        ) : null}
      </div>

      <OverviewCards viewModel={viewModel} />
      <DailyChart viewModel={viewModel} />

      <div className={styles.twoColumnGrid}>
        <VerbAccuracy viewModel={viewModel} />
        <ProblemVerbs viewModel={viewModel} />
      </div>

      <div className={styles.twoColumnGrid}>
        <LessonBreakdown viewModel={viewModel} />
        <FrequentTasks viewModel={viewModel} />
      </div>
    </section>
  );
}

function OverviewCards({ viewModel }: { viewModel: AnalyticsViewModel }) {
  return (
    <div className={styles.kpiGrid} aria-label="Общая статистика">
      <article className={styles.kpiCard}>
        <span className={styles.kpiLabel}>Всего ответов</span>
        <strong className={styles.kpiValue}>{viewModel.totalAnswers}</strong>
      </article>
      <article className={styles.kpiCard}>
        <span className={styles.kpiLabel}>Точность</span>
        <strong className={styles.kpiValue}>{viewModel.accuracy}%</strong>
      </article>
      <article className={styles.kpiCard}>
        <span className={styles.kpiLabel}>Успешно</span>
        <strong className={styles.kpiValue}>{viewModel.totalCorrect}</strong>
      </article>
      <article className={styles.kpiCard}>
        <span className={styles.kpiLabel}>Ошибок</span>
        <strong className={styles.kpiValue}>{viewModel.totalIncorrect}</strong>
      </article>
    </div>
  );
}

function DailyChart({ viewModel }: { viewModel: AnalyticsViewModel }) {
  const maxTotal = Math.max(
    ...viewModel.dailyPoints.map((dailyPoint) => dailyPoint.total),
    1,
  );

  return (
    <section className={styles.panel} aria-labelledby="daily-chart-title">
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.panelKicker}>по дням</p>
          <h2 className={styles.panelTitle} id="daily-chart-title">
            Последние тренировки
          </h2>
        </div>
        <div className={styles.legend} aria-hidden="true">
          <span className={styles.legendCorrect}>верно</span>
          <span className={styles.legendIncorrect}>ошибка</span>
        </div>
      </div>
      <div className={styles.dailyChart}>
        {viewModel.dailyPoints.map((dailyPoint) => (
          <div className={styles.dailyRow} key={dailyPoint.date}>
            <time className={styles.dailyLabel} dateTime={dailyPoint.date}>
              {dailyPoint.label}
            </time>
            <div
              className={styles.dailyTrack}
              aria-label={`${dailyPoint.label}: ${dailyPoint.correct} верно, ${dailyPoint.incorrect} ошибок`}
            >
              <span
                className={styles.dailyCorrect}
                style={{ width: `${(dailyPoint.correct / maxTotal) * 100}%` }}
              />
              <span
                className={styles.dailyIncorrect}
                style={{ width: `${(dailyPoint.incorrect / maxTotal) * 100}%` }}
              />
            </div>
            <span className={styles.dailyTotal}>{dailyPoint.total}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function VerbAccuracy({ viewModel }: { viewModel: AnalyticsViewModel }) {
  return (
    <section className={styles.panel} aria-labelledby="verb-accuracy-title">
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.panelKicker}>глаголы</p>
          <h2 className={styles.panelTitle} id="verb-accuracy-title">
            Самые отработанные
          </h2>
        </div>
      </div>
      <div className={styles.metricList}>
        {viewModel.verbRows.map((verb) => (
          <article className={styles.metricItem} key={verb.verbId}>
            <div className={styles.metricText}>
              <strong>{verb.label}</strong>
              <span>{verb.translation}</span>
            </div>
            <div className={styles.metricMeta}>
              <strong>{verb.accuracy}%</strong>
              <span>{verb.shownCount} раз</span>
            </div>
            <div className={styles.progressTrack} aria-hidden="true">
              <span
                className={styles.progressBar}
                style={{ width: `${verb.accuracy}%` }}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProblemVerbs({ viewModel }: { viewModel: AnalyticsViewModel }) {
  return (
    <section className={styles.panel} aria-labelledby="problem-verbs-title">
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.panelKicker}>фокус</p>
          <h2 className={styles.panelTitle} id="problem-verbs-title">
            Где больше ошибок
          </h2>
        </div>
      </div>
      <div className={styles.compactList}>
        {viewModel.problemVerbRows.map((verb) => (
          <article className={styles.compactItem} key={verb.verbId}>
            <span>{verb.label}</span>
            <strong>{verb.incorrect} ошибок</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function LessonBreakdown({ viewModel }: { viewModel: AnalyticsViewModel }) {
  return (
    <section className={styles.panel} aria-labelledby="lesson-breakdown-title">
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.panelKicker}>уроки</p>
          <h2 className={styles.panelTitle} id="lesson-breakdown-title">
            Разбивка по урокам
          </h2>
        </div>
      </div>
      <div className={styles.compactList}>
        {viewModel.lessonSummaries.map((lesson) => (
          <article className={styles.compactItem} key={lesson.lessonId}>
            <span>{lesson.title}</span>
            <strong>{lesson.accuracy}% · {lesson.total}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function FrequentTasks({ viewModel }: { viewModel: AnalyticsViewModel }) {
  return (
    <section className={styles.panel} aria-labelledby="frequent-tasks-title">
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.panelKicker}>частотность</p>
          <h2 className={styles.panelTitle} id="frequent-tasks-title">
            Какие задания выпадали чаще
          </h2>
        </div>
      </div>
      <div className={styles.compactList}>
        {viewModel.frequentTaskRows.map((task) => (
          <article className={styles.compactItem} key={task.taskId}>
            <span>{task.label}</span>
            <strong>{task.shownCount} раз</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
