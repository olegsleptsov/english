import { useEffect, useState } from 'react';

import { lessonAnalyticsApi } from '@/entities/lesson-analytics';
import { verbsApi, type VerbWithLearningStatus } from '@/entities/verb';
import {
  applyLessonOneAutoLearningStatus,
  createLessonOneProgressFromAnalytics,
  type LessonOneExerciseProgress,
} from '@/features/lesson-one-trainer/model/lesson-one-exercise';
import { Button } from '@/shared/ui';

import styles from './dictionary-page.module.css';

export function DictionaryPage() {
  const [verbs, setVerbs] = useState<VerbWithLearningStatus[]>([]);
  const [lessonProgress, setLessonProgress] =
    useState<LessonOneExerciseProgress>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function loadVerbs() {
      const [loadedVerbs, loadedAnalytics] = await Promise.all([
        verbsApi.getVerbs(),
        lessonAnalyticsApi.getLessonAnalytics(1),
      ]);

      if (isActive) {
        const loadedProgress = createLessonOneProgressFromAnalytics(
          loadedAnalytics,
        );

        setLessonProgress(loadedProgress);
        setVerbs(
          applyLessonOneAutoLearningStatus(loadedVerbs, loadedProgress),
        );
        setIsLoading(false);
      }
    }

    void loadVerbs();

    return () => {
      isActive = false;
    };
  }, []);

  const learnedCount = verbs.filter((verb) => verb.isLearned).length;
  const practiceCount = verbs.length - learnedCount;

  async function handleToggleVerb(verb: VerbWithLearningStatus) {
    const updatedVerb = await verbsApi.setVerbLearningStatus({
      verbId: verb.id,
      isLearned: !verb.isManuallyLearned,
    });
    const [updatedVerbWithAutoStatus] = applyLessonOneAutoLearningStatus(
      [updatedVerb],
      lessonProgress,
    );

    setVerbs((currentVerbs) =>
      currentVerbs.map((currentVerb) =>
        currentVerb.id === updatedVerb.id
          ? updatedVerbWithAutoStatus
          : currentVerb,
      ),
    );
  }

  return (
    <section className="dictionary-screen">
      <div className={styles.stats} aria-live="polite">
        <span className={styles.statsItem}>
          <span>Всего</span>
          <strong>{verbs.length}</strong>
        </span>
        <span className={styles.statsItem}>
          <span>В тренировке</span>
          <strong>{practiceCount}</strong>
        </span>
        <span className={styles.statsItem}>
          <span>Выучено</span>
          <strong>{learnedCount}</strong>
        </span>
      </div>

      {isLoading ? (
        <div className="dictionary-screen__empty">Загрузка словаря...</div>
      ) : (
        <ul className={styles.verbList} aria-label="English verbs dictionary">
          {verbs.map((verb) => (
            <li key={verb.id}>
              <Button
                className={
                  verb.isLearned
                    ? `${styles.verbCard} ${styles.verbCardLearned}`
                    : styles.verbCard
                }
                size="xl"
                type="button"
                view="flat"
                width="max"
                onClick={() => void handleToggleVerb(verb)}
              >
                <span className={styles.verbRank}>#{verb.rank}</span>
                <span className={styles.verbMain}>
                  <span className={styles.verbBase}>{verb.base}</span>
                  <span className={styles.verbTranslation}>
                    {verb.translation}
                  </span>
                </span>
                <span className={styles.verbForms}>
                  {verb.base} · {verb.pastSimple} · {verb.pastParticiple}
                </span>
                <span className={styles.verbBadges}>
                  {verb.isIrregular ? (
                    <span className={styles.verbBadge}>irregular</span>
                  ) : null}
                  <span className={styles.verbStatus}>
                    {getVerbStatusLabel(verb)}
                  </span>
                </span>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function getVerbStatusLabel(verb: VerbWithLearningStatus) {
  if (verb.isManuallyLearned) {
    return 'Выучен вручную';
  }

  if (verb.isAutoLearned) {
    return 'Освоен программой';
  }

  return 'В повторении';
}
