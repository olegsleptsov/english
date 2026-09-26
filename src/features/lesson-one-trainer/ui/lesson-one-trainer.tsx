import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { lessonAnalyticsApi } from '@/entities/lesson-analytics';
import { verbsApi, type VerbWithLearningStatus } from '@/entities/verb';
import { routes } from '@/shared/config/routes';
import { Button, TextInput } from '@/shared/ui';

import {
  createLessonOneProgressFromAnalytics,
  createLessonOneTask,
  isLessonOneAnswerCorrect,
  type LessonOneExerciseProgress,
  type LessonOneTask,
} from '../model/lesson-one-exercise';

import styles from './lesson-one-trainer.module.css';

type AnswerStatus = 'idle' | 'correct' | 'incorrect';

export function LessonOneTrainer() {
  const [verbs, setVerbs] = useState<VerbWithLearningStatus[]>([]);
  const [lessonProgress, setLessonProgress] =
    useState<LessonOneExerciseProgress>({});
  const [task, setTask] = useState<LessonOneTask | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingAnswer, setIsSavingAnswer] = useState(false);
  const [answer, setAnswer] = useState('');
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>('idle');

  useEffect(() => {
    let isActive = true;

    async function loadInitialTask() {
      const [loadedVerbs, loadedAnalytics] = await Promise.all([
        verbsApi.getVerbs(),
        lessonAnalyticsApi.getLessonAnalytics(1),
      ]);

      if (isActive) {
        const loadedProgress = createLessonOneProgressFromAnalytics(
          loadedAnalytics,
        );

        setVerbs(loadedVerbs);
        setLessonProgress(loadedProgress);
        setTask(
          createLessonOneTask({
            progress: loadedProgress,
            verbs: loadedVerbs,
          }),
        );
        setIsLoading(false);
      }
    }

    void loadInitialTask();

    return () => {
      isActive = false;
    };
  }, []);

  const hasAvailableVerbs = useMemo(
    () => verbs.some((verb) => verb.lessonOneCompatible),
    [verbs],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!task) {
      return;
    }

    if (answerStatus !== 'idle') {
      if (!isSavingAnswer) {
        handleNextTask();
      }

      return;
    }

    const isCorrect = isLessonOneAnswerCorrect(answer, task.expectedAnswer);

    setAnswerStatus(isCorrect ? 'correct' : 'incorrect');
    setIsSavingAnswer(true);

    const updatedAnalytics = await lessonAnalyticsApi.recordLessonAnswer({
      lessonId: 1,
      taskId: task.id,
      verbId: task.verb.id,
      result: isCorrect ? 'correct' : 'incorrect',
    });

    const updatedProgress = createLessonOneProgressFromAnalytics(
      updatedAnalytics,
    );

    setLessonProgress(updatedProgress);
    setIsSavingAnswer(false);
  }

  function handleNextTask() {
    setTask(
      createLessonOneTask({
        previousTask: task,
        progress: lessonProgress,
        verbs,
      }),
    );
    setAnswer('');
    setAnswerStatus('idle');
  }

  if (isLoading) {
    return (
      <section className={styles.card} aria-live="polite">
        Загрузка тренажера...
      </section>
    );
  }

  if (!task || !hasAvailableVerbs) {
    return (
      <section className={`${styles.card} ${styles.emptyCard}`}>
        <h2 className="section-title">Все доступные глаголы отмечены выученными</h2>
        <p className="section-copy">
          Верните нужные слова в повторение на странице словаря, и они снова
          появятся в заданиях.
        </p>
        <Link className={styles.textLink} to={routes.dictionary}>
          Открыть словарь
        </Link>
      </section>
    );
  }

  return (
    <section className={styles.card} aria-label="Тренажер урока 1">
      <form className={styles.form} onSubmit={handleSubmit}>
        <p className={styles.prompt}>{task.prompt}</p>
        <label className={styles.label} htmlFor="lesson-one-answer">
          Перевод на английский
        </label>
        <TextInput
          autoComplete="off"
          className={styles.input}
          id="lesson-one-answer"
          placeholder="she loves"
          size="xl"
          type="text"
          value={answer}
          onUpdate={(value) => {
            setAnswer(value);
            setAnswerStatus('idle');
          }}
        />
        <Button
          disabled={isSavingAnswer}
          className={styles.submitButton}
          size="xl"
          type="submit"
          view="action"
          width="max"
        >
          {isSavingAnswer
            ? 'Сохраняем...'
            : answerStatus === 'idle'
              ? 'Проверить'
              : 'Следующее'}
        </Button>
      </form>

      <div className={styles.feedbackSlot} aria-live="polite">
        {answerStatus !== 'idle' ? (
          <div
            className={
              answerStatus === 'correct'
                ? `${styles.feedback} ${styles.feedbackCorrect}`
                : `${styles.feedback} ${styles.feedbackIncorrect}`
            }
            role="status"
          >
            <span>
              {answerStatus === 'correct' ? 'Верно' : 'Правильный ответ'}
            </span>
            <strong>{task.expectedAnswer}</strong>
          </div>
        ) : null}
      </div>
    </section>
  );
}
