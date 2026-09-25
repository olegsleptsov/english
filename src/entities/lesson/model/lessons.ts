import { routes } from '@/shared/config/routes';

export const LESSON_COUNT = 16;

export type Lesson = {
  id: number;
  title: string;
  routePath: string;
  summary: string;
};

export const lessons: Lesson[] = Array.from({ length: LESSON_COUNT }, (_, index) => {
  const id = index + 1;

  return {
    id,
    title: `Lesson ${id}`,
    routePath: routes.lesson(id),
    summary: `Draft screen for lesson ${id}.`,
  };
});

export function getLessonById(lessonId: number) {
  return lessons.find((lesson) => lesson.id === lessonId);
}
