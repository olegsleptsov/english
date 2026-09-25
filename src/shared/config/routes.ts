export const routes = {
  home: '/',
  dictionary: '/dictionary',
  lesson: (lessonId: number) => `/lessons/${lessonId}`,
} as const;
