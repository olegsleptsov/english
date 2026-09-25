import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { verbsApi, type VerbWithLearningStatus } from '@/entities/verb';
import { routes } from '@/shared/config/routes';

import {
  createLessonOneTask,
  isLessonOneAnswerCorrect,
} from '../model/lesson-one-exercise';

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
      <section className="trainer-card" aria-live="polite">
        Загрузка тренажера...
      </section>
    );
  }

  if (!task) {
    return (
      <section className="trainer-card trainer-card--empty">
        <h2 className="section-title">Все доступные глаголы отмечены выученными</h2>
        <p className="section-copy">
          Верните нужные слова в повторение на странице словаря, и они снова
          появятся в заданиях.
        </p>
        <Link className="text-link" to={routes.dictionary}>
          Открыть словарь
        </Link>
      </section>
    );
  }

  return (
    <section className="trainer-card" aria-labelledby="lesson-one-trainer-title">
      <div className="trainer-card__header">
        <p className="screen-kicker">Тренажер урока 1</p>
        <h2 className="section-title" id="lesson-one-trainer-title">
          Базовая таблица глагола
        </h2>
        <p className="section-copy">
          В задания попадают только слова, которые не отмечены выученными в
          словаре. Доступно для тренировки: {verbs.length}.
        </p>
      </div>

      <div className="trainer-task">
        <p className="trainer-task__prompt">{task.prompt}</p>
        <dl className="trainer-task__meta">
          <div>
            <dt>Формула</dt>
            <dd>{task.hint}</dd>
          </div>
          <div>
            <dt>Формы</dt>
            <dd>
              {task.verb.base} · {task.verb.pastSimple} ·{' '}
              {task.verb.pastParticiple}
            </dd>
          </div>
        </dl>
      </div>

      <form className="trainer-answer" onSubmit={handleSubmit}>
        <label className="trainer-answer__label" htmlFor="lesson-one-answer">
          Ответ на английском
        </label>
        <input
          autoComplete="off"
          className="trainer-answer__input"
          id="lesson-one-answer"
          placeholder="Например: he works"
          type="text"
          value={answer}
          onChange={(event) => {
            setAnswer(event.target.value);
            setAnswerStatus('idle');
          }}
        />
        <div className="trainer-answer__actions">
          <button className="primary-button" type="submit">
            Проверить
          </button>
          <button className="secondary-button" type="button" onClick={handleNextTask}>
            Следующее
          </button>
        </div>
      </form>

      {answerStatus !== 'idle' ? (
        <div
          className={
            answerStatus === 'correct'
              ? 'trainer-feedback trainer-feedback--correct'
              : 'trainer-feedback trainer-feedback--incorrect'
          }
          role="status"
        >
          {answerStatus === 'correct'
            ? 'Верно.'
            : `Пока нет. Правильный ответ: ${task.expectedAnswer}`}
        </div>
      ) : null}
    </section>
  );
}
