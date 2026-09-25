import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { verbsApi, type VerbWithLearningStatus } from '@/entities/verb';
import { routes } from '@/shared/config/routes';

import {
  createLessonOneTask,
  isLessonOneAnswerCorrect,
} from '../model/lesson-one-exercise';

import styles from './lesson-one-trainer.module.css';

type AnswerStatus = 'idle' | 'correct' | 'incorrect';

export function LessonOneTrainer() {
  const [verbs, setVerbs] = useState<VerbWithLearningStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [taskIndex, setTaskIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>('idle');

  useEffect(() => {
    let isActive = true;

    async function loadVerbs() {
      const practiceVerbs = await verbsApi.getPracticeVerbs();

      if (isActive) {
        setVerbs(practiceVerbs.filter((verb) => verb.lessonOneCompatible));
        setIsLoading(false);
      }
    }

    void loadVerbs();

    return () => {
      isActive = false;
    };
  }, []);

  const task = useMemo(
    () => createLessonOneTask(verbs, taskIndex),
    [taskIndex, verbs],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!task) {
      return;
    }

    if (answerStatus !== 'idle') {
      handleNextTask();
      return;
    }

    setAnswerStatus(
      isLessonOneAnswerCorrect(answer, task.expectedAnswer)
        ? 'correct'
        : 'incorrect',
    );
  }

  function handleNextTask() {
    setTaskIndex((currentTaskIndex) => currentTaskIndex + 1);
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

  if (!task) {
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
        <input
          autoComplete="off"
          className={styles.input}
          id="lesson-one-answer"
          placeholder="she loves"
          type="text"
          value={answer}
          onChange={(event) => {
            setAnswer(event.target.value);
            setAnswerStatus('idle');
          }}
        />
        <button className={styles.submitButton} type="submit">
          {answerStatus === 'idle' ? 'Проверить' : 'Следующее'}
        </button>
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
