import { describe, expect, it } from 'vitest';

import { normalizeEnglishNegativeContractions } from './normalize-english-contractions';

describe('нормализация английских отрицательных сокращений', () => {
  it('приводит do not, don\'t и dont к одной форме', () => {
    expect(normalizeEnglishNegativeContractions("you don't say")).toBe(
      normalizeEnglishNegativeContractions('you do not say'),
    );
    expect(normalizeEnglishNegativeContractions('you dont say')).toBe(
      normalizeEnglishNegativeContractions('you do not say'),
    );
  });

  it('приводит does not, doesn\'t и doesnt к одной форме', () => {
    expect(normalizeEnglishNegativeContractions("he doesn't have")).toBe(
      normalizeEnglishNegativeContractions('he does not have'),
    );
    expect(normalizeEnglishNegativeContractions('he doesnt have')).toBe(
      normalizeEnglishNegativeContractions('he does not have'),
    );
  });

  it('приводит did not и didn\'t к одной форме', () => {
    expect(normalizeEnglishNegativeContractions("we didn't go")).toBe(
      normalizeEnglishNegativeContractions('we did not go'),
    );
  });

  it('приводит will not, won\'t и willn\'t к одной форме', () => {
    expect(normalizeEnglishNegativeContractions("we won't do")).toBe(
      normalizeEnglishNegativeContractions('we will not do'),
    );
    expect(normalizeEnglishNegativeContractions("we willn't do")).toBe(
      normalizeEnglishNegativeContractions('we will not do'),
    );
  });

  it('приводит cannot, can not, can\'t и cann\'t к одной форме', () => {
    expect(normalizeEnglishNegativeContractions('we cannot wait')).toBe(
      normalizeEnglishNegativeContractions('we can not wait'),
    );
    expect(normalizeEnglishNegativeContractions("we can't wait")).toBe(
      normalizeEnglishNegativeContractions('we can not wait'),
    );
    expect(normalizeEnglishNegativeContractions("we cann't wait")).toBe(
      normalizeEnglishNegativeContractions('we can not wait'),
    );
  });

  it('нормализует модальные отрицательные сокращения', () => {
    expect(normalizeEnglishNegativeContractions("they shouldn't stop")).toBe(
      normalizeEnglishNegativeContractions('they should not stop'),
    );
    expect(normalizeEnglishNegativeContractions("they couldn't stop")).toBe(
      normalizeEnglishNegativeContractions('they could not stop'),
    );
    expect(normalizeEnglishNegativeContractions("they mustn't stop")).toBe(
      normalizeEnglishNegativeContractions('they must not stop'),
    );
  });

  it('нормализует сокращения с пробелом перед n\'t', () => {
    expect(normalizeEnglishNegativeContractions("she does n't know")).toBe(
      normalizeEnglishNegativeContractions('she does not know'),
    );
    expect(normalizeEnglishNegativeContractions("we will n't do")).toBe(
      normalizeEnglishNegativeContractions('we will not do'),
    );
  });

  it('нормализует сокращения с типографским апострофом', () => {
    expect(normalizeEnglishNegativeContractions('she doesn’t know')).toBe(
      normalizeEnglishNegativeContractions('she does not know'),
    );
    expect(normalizeEnglishNegativeContractions('she does n’t know')).toBe(
      normalizeEnglishNegativeContractions('she does not know'),
    );
  });
});
