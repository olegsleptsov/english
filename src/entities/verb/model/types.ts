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
    };
  };
  isIrregular: boolean;
  lessonOneCompatible: boolean;
};

export type VerbWithLearningStatus = Verb & {
  isLearned: boolean;
};
