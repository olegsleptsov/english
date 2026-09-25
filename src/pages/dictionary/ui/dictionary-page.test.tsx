import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { renderWithProviders } from '@/shared/lib/testing';

import { DictionaryPage } from './dictionary-page';

describe('DictionaryPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('toggles verb learning status by clicking a verb card', async () => {
    const user = userEvent.setup();

    renderWithProviders(<DictionaryPage />);

    const verbCards = await screen.findAllByRole('button');
    const haveCard = screen.getByRole('button', { name: /have/i });

    expect(verbCards).toHaveLength(100);
    expect(haveCard).toHaveTextContent('В повторении');

    await user.click(haveCard);

    await waitFor(() => {
      expect(haveCard).toHaveTextContent('Выучен');
    });

    await user.click(haveCard);

    await waitFor(() => {
      expect(haveCard).toHaveTextContent('В повторении');
    });
  });
});
