import { LessonOneTrainer } from '@/features/lesson-one-trainer';

export function Lesson01Page() {
  return (
    <article className="lesson-screen">
      <header className="lesson-screen__header">
        <p className="screen-kicker">Lesson 1</p>
        <h1 className="screen-title">Базовая таблица глагола</h1>
        <p className="screen-lead">
          Отрабатываем три времени и три формы предложения: утверждение,
          отрицание и вопрос. Словарь управляет тем, какие глаголы попадают в
          задания.
        </p>
      </header>
      <LessonOneTrainer />
    </article>
  );
}
