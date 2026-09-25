import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '@/shared/lib/testing';

import { Counter } from './counter';

describe('Counter', () => {
  it('supports the main positive user flow', async () => {
    const user = userEvent.setup();

    renderWithProviders(<Counter />);

    const value = screen.getByLabelText('Current counter value');

    expect(value).toHaveTextContent('0');

    await user.click(screen.getByRole('button', { name: 'Increase counter' }));
    expect(value).toHaveTextContent('1');

    await user.click(screen.getByRole('button', { name: 'Decrease counter' }));
    expect(value).toHaveTextContent('0');

    await user.click(screen.getByRole('button', { name: 'Increase counter' }));
    await user.click(screen.getByRole('button', { name: 'Increase counter' }));
    expect(value).toHaveTextContent('2');

    await user.click(screen.getByRole('button', { name: 'Reset counter' }));
    expect(value).toHaveTextContent('0');
  });
});
