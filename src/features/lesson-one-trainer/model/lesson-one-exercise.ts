import type { Verb } from '@/entities/verb';

type Subject = {
  value: string;
  ru: string;
  ruKey:
    | 'firstPersonSingular'
    | 'secondPerson'
    | 'thirdPerson'
    | 'firstPersonPlural'
    | 'thirdPersonPlural';
  isThirdPersonSingular: boolean;
};

export type LessonOneSentenceType = 'statement' | 'question' | 'negative';

export type LessonOneTask = {
  id: string;
  verb: Verb;
  subject: Subject;
  sentenceType: LessonOneSentenceType;
  expectedAnswer: string;
  prompt: string;
};

const SUBJECTS: Subject[] = [
  {
    value: 'I',
    ru: 'я',
    ruKey: 'firstPersonSingular',
    isThirdPersonSingular: false,
  },
  {
    value: 'you',
    ru: 'ты',
    ruKey: 'secondPerson',
    isThirdPersonSingular: false,
  },
  {
    value: 'he',
    ru: 'он',
    ruKey: 'thirdPerson',
    isThirdPersonSingular: true,
  },
  {
    value: 'she',
    ru: 'она',
    ruKey: 'thirdPerson',
    isThirdPersonSingular: true,
  },
  {
    value: 'we',
    ru: 'мы',
    ruKey: 'firstPersonPlural',
    isThirdPersonSingular: false,
  },
  {
    value: 'they',
    ru: 'они',
    ruKey: 'thirdPersonPlural',
    isThirdPersonSingular: false,
  },
];

const SENTENCE_TYPES: LessonOneSentenceType[] = [
  'statement',
  'question',
  'negative',
];

export function createLessonOneTask(
  verbs: Verb[],
  taskIndex: number,
): LessonOneTask | null {
  const practiceVerbs = verbs.filter((verb) => verb.lessonOneCompatible);

  if (practiceVerbs.length === 0) {
    return null;
  }

  const combinationCount = SUBJECTS.length * SENTENCE_TYPES.length;
  const combinationIndex = taskIndex % combinationCount;
  const verbIndex = Math.floor(taskIndex / combinationCount) % practiceVerbs.length;
  const subjectIndex = combinationIndex % SUBJECTS.length;
  const sentenceTypeIndex = Math.floor(combinationIndex / SUBJECTS.length);
  const verb = practiceVerbs[verbIndex];
  const subject = SUBJECTS[subjectIndex];
  const sentenceType = SENTENCE_TYPES[sentenceTypeIndex];
  const expectedAnswer = createExpectedAnswer({ sentenceType, subject, verb });

  return {
    id: `${verb.id}-${subject.value}-present-${sentenceType}`,
    verb,
    subject,
    sentenceType,
    expectedAnswer,
    prompt: createRussianPrompt({ sentenceType, subject, verb }),
  };
}

export function normalizeLessonOneAnswer(answer: string) {
  return answer
    .trim()
    .replace(/[?.!]+$/u, '')
    .replace(/\s+/gu, ' ')
    .toLowerCase();
}

export function isLessonOneAnswerCorrect(answer: string, expectedAnswer: string) {
  return (
    normalizeLessonOneAnswer(answer) ===
    normalizeLessonOneAnswer(expectedAnswer)
  );
}

function createRussianPrompt({
  sentenceType,
  subject,
  verb,
}: {
  sentenceType: LessonOneSentenceType;
  subject: Subject;
  verb: Verb;
}) {
  const phrase = `${capitalize(subject.ru)} ${getRussianPresentForm({ subject, verb })}`;

  if (sentenceType === 'question') {
    return `${phrase}?`;
  }

  if (sentenceType === 'negative') {
    return `${capitalize(subject.ru)} не ${getRussianPresentForm({ subject, verb })}`;
  }

  return phrase;
}

function createExpectedAnswer({
  sentenceType,
  subject,
  verb,
}: {
  sentenceType: LessonOneSentenceType;
  subject: Subject;
  verb: Verb;
}) {
  if (sentenceType === 'question') {
    const auxiliary = subject.isThirdPersonSingular ? 'Does' : 'Do';

    return `${auxiliary} ${subject.value} ${verb.base}?`;
  }

  if (sentenceType === 'negative') {
    const auxiliary = subject.isThirdPersonSingular ? 'does' : 'do';

    return `${subject.value} ${auxiliary} not ${verb.base}`;
  }

  const verbForm = subject.isThirdPersonSingular
    ? verb.thirdPersonSingular
    : verb.base;

  return `${subject.value} ${verbForm}`;
}

function getRussianPresentForm({
  subject,
  verb,
}: {
  subject: Subject;
  verb: Verb;
}) {
  return verb.forms.ru.present[subject.ruKey];
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
