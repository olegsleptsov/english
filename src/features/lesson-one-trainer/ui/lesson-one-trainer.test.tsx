import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { lessonAnalyticsApi } from '@/entities/lesson-analytics';
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
});
