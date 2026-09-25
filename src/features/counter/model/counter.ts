export const DEFAULT_COUNTER_VALUE = 0;

export function incrementCounter(value: number) {
  return value + 1;
}

export function decrementCounter(value: number) {
  return value - 1;
}

export function resetCounter() {
  return DEFAULT_COUNTER_VALUE;
}
