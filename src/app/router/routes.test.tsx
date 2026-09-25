import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '@/shared/lib/testing';

import { appRoutes } from './routes';

describe('app routes', () => {
  it('navigates between lesson and dictionary screens', async () => {
    const user = userEvent.setup();
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ['/lessons/1'],
    });

    renderWithProviders(<RouterProvider router={router} />);

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
});
