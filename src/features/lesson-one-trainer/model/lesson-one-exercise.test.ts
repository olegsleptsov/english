import { describe, expect, it } from 'vitest';

import { COMMON_ENGLISH_VERBS } from '@/entities/verb';

import {
  createLessonOneTask,
  isLessonOneAnswerCorrect,
} from './lesson-one-exercise';

describe('lesson one exercise model', () => {
  it('creates a present statement task with third-person singular form', () => {
    const task = createLessonOneTask(
      COMMON_ENGLISH_VERBS.filter((verb) => verb.id === 'have'),
      2,
    );

    expect(task?.expectedAnswer).toBe('he has');
  });

  it('accepts answers without final punctuation and with different case', () => {
    expect(isLessonOneAnswerCorrect('  DID HE HAVE? ', 'Did he have?')).toBe(
      true,
    );
  });

  it('does not create tasks for lesson-incompatible verbs', () => {
    const task = createLessonOneTask(
      COMMON_ENGLISH_VERBS.filter((verb) => verb.id === 'be'),
      0,
    );

    expect(task).toBeNull();
  });
});
