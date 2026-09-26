export type Verb = {
  id: string;
  rank: number;
  base: string;
  russian: {
    infinitive: string;
  };
  thirdPersonSingular: string;
  pastSimple: string;
  pastParticiple: string;
  presentParticiple: string;
  translation: string;
  forms: {
    ru: {
      present: {
        firstPersonSingular: string;
        secondPerson: string;
        thirdPerson: string;
        firstPersonPlural: string;
        thirdPersonPlural: string;
      };
      past: {
        firstSecondPerson: string;
        masculine: string;
        feminine: string;
        plural: string;
      };
    };
  };
  isIrregular: boolean;
  lessonOneCompatible: boolean;
};

export type VerbWithLearningStatus = Verb & {
  isManuallyLearned: boolean;
  isAutoLearned: boolean;
  isLearned: boolean;
};
