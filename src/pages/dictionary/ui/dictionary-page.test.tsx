import { screen, waitFor } from '@testing-library/react';
import userEvent, { PointerEventsCheckLevel } from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { lessonAnalyticsApi } from '@/entities/lesson-analytics';
import {
  AUTO_LEARNED_CORRECT_COUNT,
  AUTO_LEARNED_MIN_CORRECT_BY_SENTENCE_TYPE,
  type LessonOneSentenceType,
} from '@/features/lesson-one-trainer/model/lesson-one-constants';
import { renderWithProviders } from '@/shared/lib/testing';

import { DictionaryPage } from './dictionary-page';

describe('страница словаря', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('переключает ручной статус выученности по клику на карточку глагола', async () => {
    const user = userEvent.setup({
      pointerEventsCheck: PointerEventsCheckLevel.Never,
    });

    renderWithProviders(<DictionaryPage />);

    const verbList = await screen.findByLabelText('English verbs dictionary');
    const haveCard = screen.getByText('have').closest('button');

    expect(verbList.querySelectorAll('li')).toHaveLength(100);
    expect(haveCard).toBeInstanceOf(HTMLButtonElement);
    expect(haveCard).toHaveTextContent('В повторении');

    await user.click(haveCard!);

    await waitFor(() => {
      expect(haveCard).toHaveTextContent('Выучен вручную');
    });

    await user.click(haveCard!);

    await waitFor(() => {
      expect(haveCard).toHaveTextContent('В повторении');
    });
  });

  it('показывает отдельный автоматический статус, если глагол освоен по аналитике', async () => {
    await recordMasteredVerb('have');

    renderWithProviders(<DictionaryPage />);

    const haveCard = (await screen.findByText('have')).closest('button');

    expect(haveCard).toHaveTextContent('Освоен программой');
  });
});

async function recordMasteredVerb(verbId: string) {
  const taskIds = createMasteredTaskIds(verbId);

  for (const taskId of taskIds) {
    await lessonAnalyticsApi.recordLessonAnswer({
      lessonId: 1,
      result: 'correct',
      taskId,
      verbId,
    });
  }

  await lessonAnalyticsApi.recordLessonAnswer({
    lessonId: 1,
    result: 'incorrect',
    taskId: `${verbId}-we-present-statement`,
    verbId,
  });
  await lessonAnalyticsApi.recordLessonAnswer({
    lessonId: 1,
    result: 'incorrect',
    taskId: `${verbId}-they-present-question`,
    verbId,
  });
}

function createMasteredTaskIds(verbId: string) {
  const taskCountBySentenceType = createMasteredTaskCountBySentenceType();

  return Object.entries(taskCountBySentenceType).flatMap(
    ([sentenceType, taskCount]) =>
      Array.from(
        { length: taskCount },
        (_, index) =>
          `${verbId}-${getSubjectForIndex(index)}-present-${sentenceType}`,
      ),
  );
}

function createMasteredTaskCountBySentenceType(): Record<
  LessonOneSentenceType,
  number
> {
  const minimumBySentenceType = AUTO_LEARNED_MIN_CORRECT_BY_SENTENCE_TYPE;
  const counts = {
    negative: minimumBySentenceType,
    question: minimumBySentenceType,
    statement: minimumBySentenceType,
  };
  const targetCorrect = Math.max(
    AUTO_LEARNED_CORRECT_COUNT,
    minimumBySentenceType * 3,
  );

  counts.negative +=
    targetCorrect - counts.negative - counts.question - counts.statement;

  return counts;
}

function getSubjectForIndex(index: number) {
  return ['I', 'you', 'he', 'she', 'we', 'they'][index % 6];
}
