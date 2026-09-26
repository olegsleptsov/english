export const routes = {
  home: '/',
  analytics: '/analytics',
  dictionary: '/dictionary',
  lesson: (lessonId: number) => `/lessons/${lessonId}`,
} as const;
