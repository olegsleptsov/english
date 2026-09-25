import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { renderWithProviders } from '@/shared/lib/testing';

import { LessonOneTrainer } from './lesson-one-trainer';

describe('LessonOneTrainer', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('shows the correct answer and then moves to the next phrase', async () => {
    const user = userEvent.setup();

    renderWithProviders(<LessonOneTrainer />);

    expect(await screen.findByText('Я имею')).toBeInTheDocument();

    await user.type(
      screen.getByRole('textbox', { name: 'Перевод на английский' }),
      'I have',
    );
    await user.click(screen.getByRole('button', { name: 'Проверить' }));

    expect(screen.getByRole('status')).toHaveTextContent('I have');

    await user.click(screen.getByRole('button', { name: 'Следующее' }));

    expect(await screen.findByText('Ты имеешь')).toBeInTheDocument();
  });
});
