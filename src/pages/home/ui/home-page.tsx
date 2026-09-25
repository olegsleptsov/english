import { Counter } from '@/features/counter';

export function HomePage() {
  return (
    <main className="app-shell">
      <section className="home-page" aria-labelledby="home-page-title">
        <h1 className="home-page__title" id="home-page-title">
          English
        </h1>
        <Counter />
      </section>
    </main>
  );
}
