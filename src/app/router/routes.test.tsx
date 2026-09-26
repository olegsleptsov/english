import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';

import { renderWithProviders } from '@/shared/lib/testing';
import { routes } from '@/shared/config/routes';

import { appRoutes } from './routes';

describe('маршруты приложения', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('открывает словарь из шапки', async () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ['/lessons/1'],
    });

    renderWithProviders(<RouterProvider router={router} />);

    expect(screen.queryByRole('link', { name: 'English' })).not.toBeInTheDocument();
    expect(
      await screen.findByRole('textbox', { name: 'Перевод на английский' }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('link', { name: 'Dictionary' }));

    expect(
      await screen.findByRole('list', { name: 'English verbs dictionary' }),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe(routes.dictionary);
  });

  it('переходит к выбранному уроку из навигации', async () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ['/lessons/1'],
    });

    renderWithProviders(<RouterProvider router={router} />);

    fireEvent.click(await screen.findByRole('link', { name: 'Lesson 16' }));

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Lesson 16' }),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe(routes.lesson(16));
  });

  it('открывает аналитику из шапки', async () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ['/lessons/1'],
    });

    renderWithProviders(<RouterProvider router={router} />);

    fireEvent.click(
      await screen.findByRole('link', { name: 'Открыть аналитику' }),
    );

    expect(await screen.findByText('Всего ответов')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Analytics' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe(routes.analytics);
  });

  it('открывает справку текущего урока из шапки', async () => {
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

  it('показывает формулу построения предложений в справке первого урока', async () => {
    const user = userEvent.setup();
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ['/lessons/1'],
    });

    renderWithProviders(<RouterProvider router={router} />);

    await user.click(
      await screen.findByRole('button', {
        name: 'Открыть информацию об уроке 1',
      }),
    );

    expect(screen.getByText('Формула предложений')).toBeInTheDocument();
    expect(screen.getByText('Present Simple')).toBeInTheDocument();
    expect(screen.getByText('кто + V / V-s / V-es')).toBeInTheDocument();
    expect(screen.getByText('Где нужна неправильная форма')).toBeInTheDocument();
  });

  it('переключает тему приложения из шапки', async () => {
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
