import { beforeEach, describe, expect, it } from 'vitest';

import { COMMON_ENGLISH_VERBS } from '../model/common-verbs';
import { verbsApi } from './verbs-api';

describe('verbsApi', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns 100 hardcoded common verbs with unique ids', () => {
    const ids = new Set(COMMON_ENGLISH_VERBS.map((verb) => verb.id));

    expect(COMMON_ENGLISH_VERBS).toHaveLength(100);
    expect(ids.size).toBe(100);
  });

  it('marks a verb as learned and excludes it from practice verbs', async () => {
    await verbsApi.setVerbLearningStatus({
      verbId: 'have',
      isLearned: true,
    });

    const verbs = await verbsApi.getVerbs();
    const practiceVerbs = await verbsApi.getPracticeVerbs();

    expect(verbs.find((verb) => verb.id === 'have')?.isLearned).toBe(true);
    expect(practiceVerbs.some((verb) => verb.id === 'have')).toBe(false);
  });

  it('returns a learned verb to practice when status is removed', async () => {
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
