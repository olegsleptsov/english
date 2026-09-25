import { describe, expect, it } from 'vitest';

import {
  DEFAULT_COUNTER_VALUE,
  decrementCounter,
  incrementCounter,
  resetCounter,
} from './counter';

describe('counter model', () => {
  it('increments the counter value', () => {
    expect(incrementCounter(1)).toBe(2);
  });

  it('decrements the counter value', () => {
    expect(decrementCounter(1)).toBe(0);
  });

  it('resets the counter to the default value', () => {
    expect(resetCounter()).toBe(DEFAULT_COUNTER_VALUE);
  });
});
