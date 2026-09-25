import { getLessonById } from '@/entities/lesson';

type LessonDraftProps = {
  lessonId: number;
};

export function LessonDraft({ lessonId }: LessonDraftProps) {
  const lesson = getLessonById(lessonId);

  if (!lesson) {
    return null;
  }

  return (
    <article className="lesson-screen">
      <header className="lesson-screen__header">
        <p className="screen-kicker">Lesson draft</p>
        <h1 className="screen-title">{lesson.title}</h1>
        <p className="screen-lead">{lesson.summary}</p>
      </header>
      <section className="lesson-screen__body" aria-labelledby="lesson-draft-title">
        <h2 className="section-title" id="lesson-draft-title">
          Content placeholder
        </h2>
        <p className="section-copy">
          Lesson materials, exercises, progress state, and localStorage-backed
          request adapters will be added here later.
        </p>
      </section>
    </article>
  );
}
