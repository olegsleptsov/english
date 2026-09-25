import { describe, expect, it } from 'vitest';

import { COMMON_ENGLISH_VERBS } from '@/entities/verb';

import {
  createLessonOneTask,
  isLessonOneAnswerCorrect,
} from './lesson-one-exercise';

describe('lesson one exercise model', () => {
  it('creates a Russian prompt and a present statement answer', () => {
    const task = createLessonOneTask(
      COMMON_ENGLISH_VERBS.filter((verb) => verb.id === 'have'),
      0,
    );

    expect(task?.prompt).toBe('Я имею');
    expect(task?.expectedAnswer).toBe('I have');
  });

  it('creates present question tasks', () => {
    const task = createLessonOneTask(
      COMMON_ENGLISH_VERBS.filter((verb) => verb.id === 'have'),
      6,
    );

    expect(task?.prompt).toBe('Я имею?');
    expect(task?.expectedAnswer).toBe('Do I have?');
  });

  it('creates present negative tasks', () => {
    const task = createLessonOneTask(
      COMMON_ENGLISH_VERBS.filter((verb) => verb.id === 'have'),
      14,
    );

    expect(task?.prompt).toBe('Он не имеет');
    expect(task?.expectedAnswer).toBe('he does not have');
  });

  it('accepts answers without final punctuation and with different case', () => {
    expect(isLessonOneAnswerCorrect('  DO I HAVE? ', 'Do I have?')).toBe(true);
  });

  it('does not create tasks for lesson-incompatible verbs', () => {
    const task = createLessonOneTask(
      COMMON_ENGLISH_VERBS.filter((verb) => verb.id === 'be'),
      0,
    );

    expect(task).toBeNull();
  });
});
