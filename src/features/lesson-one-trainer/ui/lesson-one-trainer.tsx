import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { lessonAnalyticsApi } from '@/entities/lesson-analytics';
import { verbsApi, type VerbWithLearningStatus } from '@/entities/verb';
import { routes } from '@/shared/config/routes';
import { showNotify } from '@/shared/lib/notify';
import { Button, TextInput } from '@/shared/ui';

import {
  createLessonOneProgressFromAnalytics,
  createLessonOneTask,
  isLessonOneAnswerCorrect,
  isLessonOneVerbAutoLearned,
  type LessonOneExerciseProgress,
  type LessonOneTask,
} from '../model/lesson-one-exercise';

import styles from './lesson-one-trainer.module.css';

type AnswerStatus = 'idle' | 'correct' | 'incorrect';

const ANSWER_REQUIRED_ERROR = 'Введите ответ: нужна хотя бы одна буква';
const ANSWER_HAS_LETTER_REGEXP = /\p{L}/u;

export function LessonOneTrainer() {
  const [verbs, setVerbs] = useState<VerbWithLearningStatus[]>([]);
  const [lessonProgress, setLessonProgress] =
    useState<LessonOneExerciseProgress>({});
  const [task, setTask] = useState<LessonOneTask | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingAnswer, setIsSavingAnswer] = useState(false);
  const [answer, setAnswer] = useState('');
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>('idle');
  const [answerError, setAnswerError] = useState<string | null>(null);

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

    if (!isAnswerValid(answer)) {
      setAnswerError(ANSWER_REQUIRED_ERROR);

      return;
    }

    setAnswerError(null);

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
    const wasAutoLearned = isLessonOneVerbAutoLearned({
      progress: lessonProgress,
      verbId: task.verb.id,
    });
    const isAutoLearned = isLessonOneVerbAutoLearned({
      progress: updatedProgress,
      verbId: task.verb.id,
    });

    if (!wasAutoLearned && isAutoLearned) {
      showNotify({
        description: 'Он больше не будет попадаться в тренировке, пока ты не вернешь его через словарь',
        title: `${task.verb.base} освоен`,
        tone: 'success',
      });
    }

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
    setAnswerError(null);
  }

  function handleTestNotify() {
    showNotify({
      description: 'Он больше не будет попадаться в тренировке, пока ты не вернешь его через словарь',
      title: 'see освоен',
      tone: 'success',
    });
  }

  if (isLoading) {
    return (
      <section
        className={`${styles.card} ${styles.loadingCard}`}
        aria-label="Загрузка тренажера"
        aria-live="polite"
        aria-busy="true"
      >
        <span className={styles.loader} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
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
          validationState={answerError ? 'invalid' : undefined}
          controlProps={{
            'aria-describedby': answerError
              ? 'lesson-one-answer-error'
              : undefined,
          }}
          onUpdate={(value) => {
            setAnswer(value);
            setAnswerStatus('idle');
            setAnswerError(null);
          }}
        />
        <div className={styles.validationSlot}>
          {answerError ? (
            <p
              className={styles.validationError}
              id="lesson-one-answer-error"
              role="alert"
            >
              {answerError}
            </p>
          ) : null}
        </div>
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

      <Button
        className={styles.testNotifyButton}
        size="m"
        type="button"
        view="outlined"
        onClick={handleTestNotify}
      >
        Показать тестовую нотификацию
      </Button>
    </section>
  );
}

function isAnswerValid(value: string) {
  return ANSWER_HAS_LETTER_REGEXP.test(value.trim());
}
