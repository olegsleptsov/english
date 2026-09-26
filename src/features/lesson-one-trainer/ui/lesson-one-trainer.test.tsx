import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { lessonAnalyticsApi } from '@/entities/lesson-analytics';
import {
  AUTO_LEARNED_CORRECT_COUNT,
  AUTO_LEARNED_MIN_CORRECT_BY_SENTENCE_TYPE,
} from '@/features/lesson-one-trainer/model/lesson-one-constants';
import { renderWithProviders } from '@/shared/lib/testing';

import { LessonOneTrainer } from './lesson-one-trainer';

describe('тренажер первого урока', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('показывает правильный ответ и затем генерирует следующую фразу', async () => {
    const user = userEvent.setup();
    vi.spyOn(Math, 'random').mockReturnValue(0);

    renderWithProviders(<LessonOneTrainer />);

    expect(await screen.findByText('Я имею')).toBeInTheDocument();

    await user.type(
      screen.getByRole('textbox', { name: 'Перевод на английский' }),
      'I have',
    );
    await user.click(screen.getByRole('button', { name: 'Проверить' }));

    expect(screen.getByRole('status')).toHaveTextContent('I have');

    await user.click(await screen.findByRole('button', { name: 'Следующее' }));

    expect(screen.queryByText('Я имею')).not.toBeInTheDocument();
    expect(
      await screen.findByRole('button', { name: 'Проверить' }),
    ).toBeInTheDocument();
  });

  it('сохраняет аналитику ответа при отправке формы', async () => {
    const user = userEvent.setup();
    vi.spyOn(Math, 'random').mockReturnValue(0);

    renderWithProviders(<LessonOneTrainer />);

    await user.type(
      await screen.findByRole('textbox', { name: 'Перевод на английский' }),
      'I have',
    );
    await user.click(screen.getByRole('button', { name: 'Проверить' }));

    await waitFor(async () => {
      const analytics = await lessonAnalyticsApi.getLessonAnalytics(1);

      expect(analytics?.daily).not.toEqual({});
      expect(analytics?.verbs.have).toMatchObject({
        shownCount: 1,
        correct: 1,
        incorrect: 0,
      });
      expect(analytics?.tasks['have-I-present-statement']).toMatchObject({
        shownCount: 1,
        correct: 1,
        incorrect: 0,
      });
    });
  });

  it('не отправляет пустой ответ и не сохраняет аналитику', async () => {
    const user = userEvent.setup();
    vi.spyOn(Math, 'random').mockReturnValue(0);

    renderWithProviders(<LessonOneTrainer />);

    await user.type(
      await screen.findByRole('textbox', { name: 'Перевод на английский' }),
      '   ',
    );
    await user.click(screen.getByRole('button', { name: 'Проверить' }));

    expect(
      await screen.findByText('Введите ответ: нужна хотя бы одна буква'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(await lessonAnalyticsApi.getLessonAnalytics(1)).toBeUndefined();
  });

  it('показывает нотификацию, когда глагол становится выученным автоматически', async () => {
    const user = userEvent.setup();
    vi.spyOn(Math, 'random').mockReturnValue(0);
    await recordAlmostMasteredVerb('have');

    renderWithProviders(<LessonOneTrainer />);

    await user.type(
      await screen.findByRole('textbox', { name: 'Перевод на английский' }),
      'I have',
    );
    await user.click(screen.getByRole('button', { name: 'Проверить' }));

    expect(await screen.findByText('have освоен')).toBeInTheDocument();
  });

  it('показывает тестовую нотификацию по ручной кнопке', async () => {
    const user = userEvent.setup();

    renderWithProviders(<LessonOneTrainer />);

    await user.click(
      await screen.findByRole('button', {
        name: 'Показать тестовую нотификацию',
      }),
    );

    expect(await screen.findByText('see освоен')).toBeInTheDocument();
  });
});

async function recordAlmostMasteredVerb(verbId: string) {
  const statementCorrectCount =
    AUTO_LEARNED_CORRECT_COUNT -
    AUTO_LEARNED_MIN_CORRECT_BY_SENTENCE_TYPE * 2 -
    1;
  const taskIds = [
    ...Array.from(
      { length: statementCorrectCount },
      () => `${verbId}-I-present-statement`,
    ),
    ...Array.from(
      { length: AUTO_LEARNED_MIN_CORRECT_BY_SENTENCE_TYPE },
      () => `${verbId}-I-present-question`,
    ),
    ...Array.from(
      { length: AUTO_LEARNED_MIN_CORRECT_BY_SENTENCE_TYPE },
      () => `${verbId}-I-present-negative`,
    ),
  ];

  for (const taskId of taskIds) {
    await lessonAnalyticsApi.recordLessonAnswer({
      lessonId: 1,
      result: 'correct',
      taskId,
      verbId,
    });
  }
}
