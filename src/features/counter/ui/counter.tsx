import { useCounter } from '../model/use-counter';

export function Counter() {
  const { decrement, increment, reset, value } = useCounter();

  return (
    <section className="counter" aria-labelledby="counter-title">
      <div className="counter__header">
        <h2 className="counter__title" id="counter-title">
          Counter
        </h2>
        <output
          aria-label="Current counter value"
          aria-live="polite"
          className="counter__value"
        >
          {value}
        </output>
      </div>
      <div className="counter__controls">
        <button
          aria-label="Decrease counter"
          className="counter__button"
          type="button"
          onClick={decrement}
        >
          -
        </button>
        <button
          aria-label="Reset counter"
          className="counter__button"
          type="button"
          onClick={reset}
        >
          Reset
        </button>
        <button
          aria-label="Increase counter"
          className="counter__button counter__button--primary"
          type="button"
          onClick={increment}
        >
          +
        </button>
      </div>
    </section>
  );
}
