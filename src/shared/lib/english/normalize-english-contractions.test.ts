import { describe, expect, it } from 'vitest';

import { normalizeEnglishNegativeContractions } from './normalize-english-contractions';

describe('нормализация английских отрицательных сокращений', () => {
  it("заменяет do not на don't", () => {
    expect(normalizeEnglishNegativeContractions('you do not say')).toBe(
      "you don't say",
    );
  });

  it("заменяет does not на doesn't", () => {
    expect(normalizeEnglishNegativeContractions('he does not have')).toBe(
      "he doesn't have",
    );
  });

  it('считает полную и сокращенную форму одинаковой после нормализации', () => {
    expect(normalizeEnglishNegativeContractions("you don't say")).toBe(
      normalizeEnglishNegativeContractions('you do not say'),
    );
  });

  it('поддерживает похожие отрицательные формы из будущих уроков', () => {
    expect(normalizeEnglishNegativeContractions('I will not go')).toBe(
      "I won't go",
    );
    expect(normalizeEnglishNegativeContractions('we cannot wait')).toBe(
      "we can't wait",
    );
    expect(normalizeEnglishNegativeContractions('they should not stop')).toBe(
      "they shouldn't stop",
    );
  });

  it('нормализует сокращения с типографским апострофом', () => {
    expect(normalizeEnglishNegativeContractions('she doesn’t know')).toBe(
      "she doesn't know",
    );
    expect(normalizeEnglishNegativeContractions('she does n’t know')).toBe(
      "she doesn't know",
    );
  });
});
