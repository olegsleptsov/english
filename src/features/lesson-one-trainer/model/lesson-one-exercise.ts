import type { Verb } from '@/entities/verb';

export type LessonOneTense = 'present' | 'past' | 'future';
export type LessonOneSentenceType = 'statement' | 'question' | 'negative';

type Subject = {
  value: string;
  ru: string;
  isThirdPersonSingular: boolean;
};

export type LessonOneTask = {
  id: string;
  verb: Verb;
  subject: Subject;
  tense: LessonOneTense;
  sentenceType: LessonOneSentenceType;
  expectedAnswer: string;
  prompt: string;
  hint: string;
};

const SUBJECTS: Subject[] = [
  { value: 'I', ru: 'я', isThirdPersonSingular: false },
  { value: 'you', ru: 'ты/вы', isThirdPersonSingular: false },
  { value: 'he', ru: 'он', isThirdPersonSingular: true },
  { value: 'she', ru: 'она', isThirdPersonSingular: true },
  { value: 'we', ru: 'мы', isThirdPersonSingular: false },
  { value: 'they', ru: 'они', isThirdPersonSingular: false },
];

const TENSES: LessonOneTense[] = ['present', 'past', 'future'];
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

  const combinationCount = SUBJECTS.length * TENSES.length * SENTENCE_TYPES.length;
  const combinationIndex = taskIndex % combinationCount;
  const verbIndex = Math.floor(taskIndex / combinationCount) % practiceVerbs.length;
  const subjectIndex = combinationIndex % SUBJECTS.length;
  const tenseIndex = Math.floor(combinationIndex / SUBJECTS.length) % TENSES.length;
  const sentenceTypeIndex =
    Math.floor(combinationIndex / (SUBJECTS.length * TENSES.length)) %
    SENTENCE_TYPES.length;

  const verb = practiceVerbs[verbIndex];
  const subject = SUBJECTS[subjectIndex];
  const tense = TENSES[tenseIndex];
  const sentenceType = SENTENCE_TYPES[sentenceTypeIndex];
  const expectedAnswer = buildLessonOneAnswer({
    sentenceType,
    subject,
    tense,
    verb,
  });

  return {
    id: `${verb.id}-${subject.value}-${tense}-${sentenceType}`,
    verb,
    subject,
    tense,
    sentenceType,
    expectedAnswer,
    prompt: createPrompt({ sentenceType, subject, tense, verb }),
    hint: getFormulaHint({ sentenceType, subject, tense }),
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

function buildLessonOneAnswer({
  sentenceType,
  subject,
  tense,
  verb,
}: {
  sentenceType: LessonOneSentenceType;
  subject: Subject;
  tense: LessonOneTense;
  verb: Verb;
}) {
  if (sentenceType === 'statement') {
    return buildStatement({ subject, tense, verb });
  }

  if (sentenceType === 'question') {
    return buildQuestion({ subject, tense, verb });
  }

  return buildNegative({ subject, tense, verb });
}

function buildStatement({
  subject,
  tense,
  verb,
}: {
  subject: Subject;
  tense: LessonOneTense;
  verb: Verb;
}) {
  if (tense === 'present') {
    const verbForm = subject.isThirdPersonSingular
      ? verb.thirdPersonSingular
      : verb.base;

    return `${subject.value} ${verbForm}`;
  }

  if (tense === 'past') {
    return `${subject.value} ${getPrimaryForm(verb.pastSimple)}`;
  }

  return `${subject.value} will ${verb.base}`;
}

function buildQuestion({
  subject,
  tense,
  verb,
}: {
  subject: Subject;
  tense: LessonOneTense;
  verb: Verb;
}) {
  if (tense === 'present') {
    const auxiliary = subject.isThirdPersonSingular ? 'Does' : 'Do';

    return `${auxiliary} ${subject.value} ${verb.base}?`;
  }

  if (tense === 'past') {
    return `Did ${subject.value} ${verb.base}?`;
  }

  return `Will ${subject.value} ${verb.base}?`;
}

function buildNegative({
  subject,
  tense,
  verb,
}: {
  subject: Subject;
  tense: LessonOneTense;
  verb: Verb;
}) {
  if (tense === 'present') {
    const auxiliary = subject.isThirdPersonSingular ? 'does' : 'do';

    return `${subject.value} ${auxiliary} not ${verb.base}`;
  }

  if (tense === 'past') {
    return `${subject.value} did not ${verb.base}`;
  }

  return `${subject.value} will not ${verb.base}`;
}

function createPrompt({
  sentenceType,
  subject,
  tense,
  verb,
}: {
  sentenceType: LessonOneSentenceType;
  subject: Subject;
  tense: LessonOneTense;
  verb: Verb;
}) {
  return [
    `Собери ${getSentenceTypeLabel(sentenceType).toLowerCase()} в ${getTenseLabel(tense)}.`,
    `Подлежащее: ${subject.ru}.`,
    `Глагол: ${verb.base} — ${verb.translation}.`,
  ].join(' ');
}

function getFormulaHint({
  sentenceType,
  subject,
  tense,
}: {
  sentenceType: LessonOneSentenceType;
  subject: Subject;
  tense: LessonOneTense;
}) {
  if (sentenceType === 'statement' && tense === 'present') {
    return subject.isThirdPersonSingular
      ? 'he/she/it + verb-s'
      : 'subject + verb';
  }

  if (sentenceType === 'statement' && tense === 'past') {
    return 'subject + V2';
  }

  if (sentenceType === 'statement' && tense === 'future') {
    return 'subject + will + verb';
  }

  if (sentenceType === 'question' && tense === 'present') {
    return subject.isThirdPersonSingular
      ? 'Does + subject + verb?'
      : 'Do + subject + verb?';
  }

  if (sentenceType === 'question' && tense === 'past') {
    return 'Did + subject + verb?';
  }

  if (sentenceType === 'question' && tense === 'future') {
    return 'Will + subject + verb?';
  }

  if (sentenceType === 'negative' && tense === 'present') {
    return subject.isThirdPersonSingular
      ? 'subject + does not + verb'
      : 'subject + do not + verb';
  }

  if (sentenceType === 'negative' && tense === 'past') {
    return 'subject + did not + verb';
  }

  return 'subject + will not + verb';
}

function getSentenceTypeLabel(sentenceType: LessonOneSentenceType) {
  if (sentenceType === 'statement') {
    return 'Утверждение';
  }

  if (sentenceType === 'question') {
    return 'Вопрос';
  }

  return 'Отрицание';
}

function getTenseLabel(tense: LessonOneTense) {
  if (tense === 'present') {
    return 'Present Simple';
  }

  if (tense === 'past') {
    return 'Past Simple';
  }

  return 'Future Simple';
}

function getPrimaryForm(form: string) {
  return form.split('/')[0];
}
