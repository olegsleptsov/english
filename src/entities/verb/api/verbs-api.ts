import { localStorageClient } from '@/shared/api/local-storage-client';

import { COMMON_ENGLISH_VERBS } from '../model/common-verbs';
import type { VerbWithLearningStatus } from '../model/types';

const LEARNED_VERB_IDS_STORAGE_KEY = 'polyglot.learnedVerbIds.v1';

export type SetVerbLearningStatusRequest = {
  verbId: string;
  isLearned: boolean;
};

export const verbsApi = {
  async getVerbs(): Promise<VerbWithLearningStatus[]> {
    return getVerbsWithLearningStatus();
  },

  async getPracticeVerbs(): Promise<VerbWithLearningStatus[]> {
    const verbs = await getVerbsWithLearningStatus();

    return verbs.filter((verb) => !verb.isLearned);
  },

  async setVerbLearningStatus({
    verbId,
    isLearned,
  }: SetVerbLearningStatusRequest): Promise<VerbWithLearningStatus> {
    const learnedVerbIds = await readLearnedVerbIds();

    if (isLearned) {
      learnedVerbIds.add(verbId);
    } else {
      learnedVerbIds.delete(verbId);
    }

    await writeLearnedVerbIds(learnedVerbIds);

    const updatedVerb = (await getVerbsWithLearningStatus()).find(
      (verb) => verb.id === verbId,
    );

    if (!updatedVerb) {
      throw new Error(`Verb "${verbId}" was not found.`);
    }

    return updatedVerb;
  },
};

async function getVerbsWithLearningStatus() {
  const learnedVerbIds = await readLearnedVerbIds();

  return COMMON_ENGLISH_VERBS.map((verb) => ({
    ...verb,
    isAutoLearned: false,
    isLearned: learnedVerbIds.has(verb.id),
    isManuallyLearned: learnedVerbIds.has(verb.id),
  }));
}

async function readLearnedVerbIds() {
  const ids = await localStorageClient.getJson<string[]>(
    LEARNED_VERB_IDS_STORAGE_KEY,
    [],
  );

  return new Set(ids);
}

async function writeLearnedVerbIds(learnedVerbIds: Set<string>) {
  await localStorageClient.setJson(
    LEARNED_VERB_IDS_STORAGE_KEY,
    Array.from(learnedVerbIds),
  );
}
