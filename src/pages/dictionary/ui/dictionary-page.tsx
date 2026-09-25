export function DictionaryPage() {
  return (
    <section className="dictionary-screen">
      <header className="dictionary-screen__header">
        <p className="screen-kicker">Reference draft</p>
        <h1 className="screen-title">Dictionary</h1>
        <p className="screen-lead">
          A vocabulary screen placeholder for future localStorage-backed data.
        </p>
      </header>
      <div className="dictionary-screen__empty">
        <h2 className="section-title">Vocabulary placeholder</h2>
        <p className="section-copy">
          Words, translations, examples, and learning status will appear here.
        </p>
      </div>
    </section>
  );
}
