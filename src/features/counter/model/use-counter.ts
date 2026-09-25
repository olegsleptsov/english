import { useCallback, useState } from 'react';

import {
  DEFAULT_COUNTER_VALUE,
  decrementCounter,
  incrementCounter,
  resetCounter,
} from './counter';

export function useCounter(initialValue = DEFAULT_COUNTER_VALUE) {
  const [value, setValue] = useState(initialValue);

  const increment = useCallback(() => {
    setValue(incrementCounter);
  }, []);

  const decrement = useCallback(() => {
    setValue(decrementCounter);
  }, []);

  const reset = useCallback(() => {
    setValue(resetCounter());
  }, []);

  return {
    value,
    increment,
    decrement,
    reset,
  };
}
