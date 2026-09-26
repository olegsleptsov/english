import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';

import { lessonAnalyticsApi } from '@/entities/lesson-analytics';
import { renderWithProviders } from '@/shared/lib/testing';

import { AnalyticsPage } from './analytics-page';

describe('AnalyticsPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders analytics from the storage api', async () => {
    await lessonAnalyticsApi.recordLessonAnswer({
      lessonId: 1,
      taskId: 'have-I-present-statement',
      verbId: 'have',
      result: 'correct',
      occurredAt: '2026-09-25T10:00:00.000Z',
    });
    await lessonAnalyticsApi.recordLessonAnswer({
      lessonId: 1,
      taskId: 'have-I-present-statement',
      verbId: 'have',
      result: 'incorrect',
      occurredAt: '2026-09-25T11:00:00.000Z',
    });

    renderWithProviders(
      <MemoryRouter>
        <AnalyticsPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText('Всего ответов')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: 'Analytics' }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('50%').length).toBeGreaterThan(0);
    expect(screen.getAllByText('have').length).toBeGreaterThan(0);
    expect(screen.queryByText('demo data')).not.toBeInTheDocument();
  });

  it('shows mock analytics while the real storage is empty', async () => {
    renderWithProviders(
      <MemoryRouter>
        <AnalyticsPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText('demo data')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Последние тренировки',
      }),
    ).toBeInTheDocument();
  });
});
