export type LessonOneSubject = {
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

export type LessonOneTaskGenerationConfig = {
  windowSize: number;
  autoLearnedCorrectCount: number;
  autoLearnedMinAccuracy: number;
  autoLearnedMinAttempts: number;
  autoLearnedMinCorrectBySentenceType: number;
};

// Размер скользящего окна: одновременно тренируем ограниченный набор глаголов,
// чтобы рандом не разбрасывал пользователя по всему словарю.
export const LESSON_ONE_VERB_WINDOW_SIZE = 10;

// Сколько правильных ответов по глаголу нужно накопить для авто-освоения.
export const AUTO_LEARNED_CORRECT_COUNT = 15;

// Минимальная точность в процентах: глагол не считается освоенным,
// если правильных ответов много, но ошибок слишком много относительно попыток.
export const AUTO_LEARNED_MIN_ACCURACY = 80;

// Минимальное число попыток: защищает от авто-освоения после короткой удачной серии.
export const AUTO_LEARNED_MIN_ATTEMPTS = 10;

// Минимум правильных ответов на каждый тип конструкции: утверждение, вопрос, отрицание.
export const AUTO_LEARNED_MIN_CORRECT_BY_SENTENCE_TYPE = 2;

export const LESSON_ONE_SUBJECTS: LessonOneSubject[] = [
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

export const LESSON_ONE_SENTENCE_TYPES: LessonOneSentenceType[] = [
  'statement',
  'question',
  'negative',
];

export const DEFAULT_LESSON_ONE_TASK_GENERATION_CONFIG: LessonOneTaskGenerationConfig = {
  windowSize: LESSON_ONE_VERB_WINDOW_SIZE,
  autoLearnedCorrectCount: AUTO_LEARNED_CORRECT_COUNT,
  autoLearnedMinAccuracy: AUTO_LEARNED_MIN_ACCURACY,
  autoLearnedMinAttempts: AUTO_LEARNED_MIN_ATTEMPTS,
  autoLearnedMinCorrectBySentenceType:
    AUTO_LEARNED_MIN_CORRECT_BY_SENTENCE_TYPE,
};
