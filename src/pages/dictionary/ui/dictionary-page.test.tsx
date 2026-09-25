import { screen, waitFor } from '@testing-library/react';
import userEvent, { PointerEventsCheckLevel } from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { renderWithProviders } from '@/shared/lib/testing';

import { DictionaryPage } from './dictionary-page';

describe('DictionaryPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('toggles verb learning status by clicking a verb card', async () => {
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
      expect(haveCard).toHaveTextContent('Выучен');
    });

    await user.click(haveCard!);

    await waitFor(() => {
      expect(haveCard).toHaveTextContent('В повторении');
    });
  });
});
