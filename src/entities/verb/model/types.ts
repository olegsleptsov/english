export type Verb = {
  id: string;
  rank: number;
  base: string;
  thirdPersonSingular: string;
  pastSimple: string;
  pastParticiple: string;
  presentParticiple: string;
  translation: string;
  isIrregular: boolean;
  lessonOneCompatible: boolean;
};

export type VerbWithLearningStatus = Verb & {
  isLearned: boolean;
};
