import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';

import { renderWithProviders } from '@/shared/lib/testing';

import { appRoutes } from './routes';

describe('app routes', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('navigates between lesson and dictionary screens', async () => {
    const user = userEvent.setup();
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ['/lessons/1'],
    });

    renderWithProviders(<RouterProvider router={router} />);

    expect(screen.queryByRole('link', { name: 'English' })).not.toBeInTheDocument();
    expect(
      await screen.findByRole('textbox', { name: 'Перевод на английский' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Dictionary' }));

    expect(
      await screen.findByRole('list', { name: 'English verbs dictionary' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Lesson 16' }));

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Lesson 16' }),
    ).toBeInTheDocument();
  });

  it('opens route-specific lesson details from the header', async () => {
    const user = userEvent.setup();
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ['/lessons/2'],
    });

    renderWithProviders(<RouterProvider router={router} />);

    await user.click(
      await screen.findByRole('button', {
        name: 'Открыть информацию об уроке 2',
      }),
    );

    expect(
      screen.getByRole('dialog', {
        name: 'Урок 2: местоимения и вопросительные слова',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('to, from, in', { exact: false })).toBeInTheDocument();
  });

  it('toggles the app theme from the header', async () => {
    const user = userEvent.setup();
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ['/lessons/1'],
    });

    renderWithProviders(<RouterProvider router={router} />);

    await user.click(
      await screen.findByRole('button', { name: 'Включить темную тему' }),
    );

    expect(
      screen.getByRole('button', { name: 'Включить светлую тему' }),
    ).toBeInTheDocument();
  });
});
