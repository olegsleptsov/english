import { beforeEach, describe, expect, it } from 'vitest';

import { COMMON_ENGLISH_VERBS } from '../model/common-verbs';
import { verbsApi } from './verbs-api';

describe('интерфейс глаголов', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('возвращает 100 захардкоженных частотных глаголов с уникальными идентификаторами', () => {
    const ids = new Set(COMMON_ENGLISH_VERBS.map((verb) => verb.id));

    expect(COMMON_ENGLISH_VERBS).toHaveLength(100);
    expect(ids.size).toBe(100);
  });

  it('хранит русский инфинитив и формы настоящего времени в данных глагола', () => {
    expect(
      COMMON_ENGLISH_VERBS.every(
        (verb) =>
          verb.russian.infinitive.length > 0 &&
          verb.forms.ru.present.firstPersonSingular.length > 0 &&
          verb.forms.ru.present.secondPerson.length > 0 &&
          verb.forms.ru.present.firstPersonPlural.length > 0 &&
          verb.forms.ru.present.thirdPersonPlural.length > 0 &&
          verb.forms.ru.present.thirdPerson.length > 0,
      ),
    ).toBe(true);
  });

  it('помечает глагол как выученный вручную и исключает его из тренировки', async () => {
    await verbsApi.setVerbLearningStatus({
      verbId: 'have',
      isLearned: true,
    });

    const verbs = await verbsApi.getVerbs();
    const practiceVerbs = await verbsApi.getPracticeVerbs();

    expect(verbs.find((verb) => verb.id === 'have')?.isLearned).toBe(true);
    expect(verbs.find((verb) => verb.id === 'have')?.isManuallyLearned).toBe(
      true,
    );
    expect(verbs.find((verb) => verb.id === 'have')?.isAutoLearned).toBe(false);
    expect(practiceVerbs.some((verb) => verb.id === 'have')).toBe(false);
  });

  it('возвращает вручную выученный глагол в тренировку после снятия отметки', async () => {
    await verbsApi.setVerbLearningStatus({
      verbId: 'have',
      isLearned: true,
    });
    await verbsApi.setVerbLearningStatus({
      verbId: 'have',
      isLearned: false,
    });

    const practiceVerbs = await verbsApi.getPracticeVerbs();

    expect(practiceVerbs.some((verb) => verb.id === 'have')).toBe(true);
  });
});
