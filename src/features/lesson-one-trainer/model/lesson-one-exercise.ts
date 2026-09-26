import type { LessonAnalytics } from '@/entities/lesson-analytics';
import type { Verb, VerbWithLearningStatus } from '@/entities/verb';

import {
  DEFAULT_LESSON_ONE_TASK_GENERATION_CONFIG,
  LESSON_ONE_SENTENCE_TYPES,
  LESSON_ONE_SUBJECTS,
  type LessonOneSentenceType,
  type LessonOneSubject,
  type LessonOneTaskGenerationConfig,
} from './lesson-one-constants';

export type { LessonOneSentenceType } from './lesson-one-constants';

export type LessonOneTask = {
  id: string;
  verb: Verb;
  subject: LessonOneSubject;
  sentenceType: LessonOneSentenceType;
  expectedAnswer: string;
  prompt: string;
};

export type RandomGenerator = () => number;

export type LessonOneSentenceTypeProgress = {
  correct: number;
  incorrect: number;
};

export type LessonOneVerbProgress = {
  verbId: string;
  shownCount: number;
  correct: number;
  incorrect: number;
  sentenceTypes: Record<LessonOneSentenceType, LessonOneSentenceTypeProgress>;
};

export type LessonOneExerciseProgress = Record<string, LessonOneVerbProgress>;

export type LessonOneTaskGenerationParams = {
  verbs: Verb[];
  progress?: LessonOneExerciseProgress;
  previousTask?: LessonOneTask | null;
  rng?: RandomGenerator;
  config?: Partial<LessonOneTaskGenerationConfig>;
};

export function createLessonOneTask({
  config: configOverride,
  previousTask,
  progress,
  rng = Math.random,
  verbs,
}: LessonOneTaskGenerationParams): LessonOneTask | null {
  const config = createGenerationConfig(configOverride);
  const practiceWindow = getLessonOnePracticeWindow({
    config,
    progress,
    verbs,
  });

  if (practiceWindow.length === 0) {
    return null;
  }

  const verb = selectWeighted({
    getWeight: (practiceVerb) =>
      getVerbWeight({ config, previousTask, progress, verb: practiceVerb }),
    items: practiceWindow,
    rng,
  });
  const sentenceType = selectWeighted({
    getWeight: (currentSentenceType) =>
      getSentenceTypeWeight({
        config,
        previousTask,
        progress,
        sentenceType: currentSentenceType,
        verb,
      }),
    items: LESSON_ONE_SENTENCE_TYPES,
    rng,
  });
  const subject = selectWeighted({
    getWeight: (currentSubject) =>
      getSubjectWeight({ previousTask, subject: currentSubject }),
    items: LESSON_ONE_SUBJECTS,
    rng,
  });
  const expectedAnswer = createExpectedAnswer({ sentenceType, subject, verb });

  return {
    id: createLessonOneTaskId({ sentenceType, subject, verb }),
    verb,
    subject,
    sentenceType,
    expectedAnswer,
    prompt: createRussianPrompt({ sentenceType, subject, verb }),
  };
}

export function applyLessonOneAutoLearningStatus<TVerb extends Verb>(
  verbs: TVerb[],
  progress: LessonOneExerciseProgress | undefined,
): Array<TVerb & VerbWithLearningStatus> {
  return verbs.map((verb) => {
    const isManuallyLearned = getIsManuallyLearned(verb);
    const isAutoLearned =
      getIsAutoLearned(verb) ||
      isLessonOneVerbAutoLearned({
        progress,
        verbId: verb.id,
      });

    return {
      ...verb,
      isAutoLearned,
      isLearned: isManuallyLearned || isAutoLearned,
      isManuallyLearned,
    };
  });
}

export function getLessonOnePracticeWindow({
  config: configOverride,
  progress,
  verbs,
}: {
  verbs: Verb[];
  progress?: LessonOneExerciseProgress;
  config?: Partial<LessonOneTaskGenerationConfig>;
}) {
  const config = createGenerationConfig(configOverride);

  return verbs
    .filter((verb) =>
      isLessonOneVerbAvailableForPractice({ config, progress, verb }),
    )
    .sort((firstVerb, secondVerb) => firstVerb.rank - secondVerb.rank)
    .slice(0, config.windowSize);
}

export function isLessonOneVerbAutoLearned({
  config: configOverride,
  progress,
  verbId,
}: {
  verbId: string;
  progress?: LessonOneExerciseProgress;
  config?: Partial<LessonOneTaskGenerationConfig>;
}) {
  const config = createGenerationConfig(configOverride);
  const verbStats = progress?.[verbId];

  if (!verbStats) {
    return false;
  }

  const totalAnswers = verbStats.correct + verbStats.incorrect;
  const accuracy = getPercent(verbStats.correct, totalAnswers);

  return (
    verbStats.correct >= config.autoLearnedCorrectCount &&
    verbStats.shownCount >= config.autoLearnedMinAttempts &&
    accuracy >= config.autoLearnedMinAccuracy &&
    LESSON_ONE_SENTENCE_TYPES.every(
      (sentenceType) =>
        verbStats.sentenceTypes[sentenceType].correct >=
        config.autoLearnedMinCorrectBySentenceType,
    )
  );
}

export function createLessonOneProgressFromAnalytics(
  analytics: LessonAnalytics | undefined,
): LessonOneExerciseProgress {
  const progress: LessonOneExerciseProgress = {};

  Object.values(analytics?.verbs ?? {}).forEach((verbStats) => {
    progress[verbStats.verbId] = {
      correct: verbStats.correct,
      incorrect: verbStats.incorrect,
      sentenceTypes: createEmptySentenceTypeProgress(),
      shownCount: verbStats.shownCount,
      verbId: verbStats.verbId,
    };
  });

  Object.values(analytics?.tasks ?? {}).forEach((task) => {
    const parsedTaskId = parseLessonOneTaskId(task.taskId);

    if (!parsedTaskId) {
      return;
    }

    const verbProgress = getOrCreateVerbProgress(progress, parsedTaskId.verbId);
    const sentenceTypeProgress =
      verbProgress.sentenceTypes[parsedTaskId.sentenceType];

    sentenceTypeProgress.correct += task.correct;
    sentenceTypeProgress.incorrect += task.incorrect;
  });

  return progress;
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

function isLessonOneVerbAvailableForPractice({
  config,
  progress,
  verb,
}: {
  verb: Verb;
  config: LessonOneTaskGenerationConfig;
  progress: LessonOneExerciseProgress | undefined;
}) {
  return (
    verb.lessonOneCompatible &&
    !getIsManuallyLearned(verb) &&
    !getIsAutoLearned(verb) &&
    !isLessonOneVerbAutoLearned({
      config,
      progress,
      verbId: verb.id,
    })
  );
}

function getVerbWeight({
  config,
  previousTask,
  progress,
  verb,
}: {
  verb: Verb;
  previousTask: LessonOneTask | null | undefined;
  config: LessonOneTaskGenerationConfig;
  progress: LessonOneExerciseProgress | undefined;
}) {
  const verbStats = progress?.[verb.id];
  const correct = verbStats?.correct ?? 0;
  const incorrect = verbStats?.incorrect ?? 0;
  const shownCount = verbStats?.shownCount ?? 0;
  const remainingCorrect = Math.max(config.autoLearnedCorrectCount - correct, 0);
  const sentenceTypeProgress =
    verbStats?.sentenceTypes ?? createEmptySentenceTypeProgress();
  const missingSentenceTypeCoverage = LESSON_ONE_SENTENCE_TYPES.reduce(
    (totalMissing, sentenceType) =>
      totalMissing +
      Math.max(
        config.autoLearnedMinCorrectBySentenceType -
          sentenceTypeProgress[sentenceType].correct,
        0,
      ),
    0,
  );
  const accuracy = getPercent(correct, correct + incorrect);
  const lowAccuracyBonus =
    shownCount > 0 ? Math.max(config.autoLearnedMinAccuracy - accuracy, 0) / 10 : 0;
  const newVerbBonus = shownCount === 0 ? 4 : 0;
  const previousVerbPenalty = previousTask?.verb.id === verb.id ? 0 : 1;

  if (previousTask?.verb.id === verb.id) {
    return 0;
  }

  return (
    previousVerbPenalty +
    newVerbBonus +
    remainingCorrect +
    incorrect * 2 +
    lowAccuracyBonus +
    missingSentenceTypeCoverage * 2
  );
}

function getSentenceTypeWeight({
  config,
  previousTask,
  progress,
  sentenceType,
  verb,
}: {
  config: LessonOneTaskGenerationConfig;
  previousTask: LessonOneTask | null | undefined;
  progress: LessonOneExerciseProgress | undefined;
  sentenceType: LessonOneSentenceType;
  verb: Verb;
}) {
  const sentenceTypeProgress =
    progress?.[verb.id]?.sentenceTypes ?? createEmptySentenceTypeProgress();
  const currentProgress = sentenceTypeProgress[sentenceType];
  const missingCorrect = Math.max(
    config.autoLearnedMinCorrectBySentenceType - currentProgress.correct,
    0,
  );

  if (previousTask?.sentenceType === sentenceType) {
    return 0.25;
  }

  return 1 + missingCorrect * 4 + currentProgress.incorrect * 2;
}

function getSubjectWeight({
  previousTask,
  subject,
}: {
  previousTask: LessonOneTask | null | undefined;
  subject: LessonOneSubject;
}) {
  if (previousTask?.subject.value === subject.value) {
    return 0.25;
  }

  return 1;
}

function createEmptySentenceTypeProgress(): Record<
  LessonOneSentenceType,
  LessonOneSentenceTypeProgress
> {
  return {
    negative: {
      correct: 0,
      incorrect: 0,
    },
    question: {
      correct: 0,
      incorrect: 0,
    },
    statement: {
      correct: 0,
      incorrect: 0,
    },
  };
}

function getOrCreateVerbProgress(
  progress: LessonOneExerciseProgress,
  verbId: string,
) {
  progress[verbId] ??= {
    correct: 0,
    incorrect: 0,
    sentenceTypes: createEmptySentenceTypeProgress(),
    shownCount: 0,
    verbId,
  };

  return progress[verbId];
}

function selectWeighted<TItem>({
  getWeight,
  items,
  rng,
}: {
  items: TItem[];
  getWeight: (item: TItem) => number;
  rng: RandomGenerator;
}) {
  const weightedItems = items.map((item) => ({
    item,
    weight: Math.max(getWeight(item), 0),
  }));
  const totalWeight = weightedItems.reduce(
    (total, weightedItem) => total + weightedItem.weight,
    0,
  );

  if (totalWeight === 0) {
    return items[0];
  }

  const target = clampRandomValue(rng()) * totalWeight;
  let cursor = 0;

  for (const weightedItem of weightedItems) {
    cursor += weightedItem.weight;

    if (target < cursor) {
      return weightedItem.item;
    }
  }

  return weightedItems[weightedItems.length - 1].item;
}

function createRussianPrompt({
  sentenceType,
  subject,
  verb,
}: {
  sentenceType: LessonOneSentenceType;
  subject: LessonOneSubject;
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
  subject: LessonOneSubject;
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

function createLessonOneTaskId({
  sentenceType,
  subject,
  verb,
}: {
  sentenceType: LessonOneSentenceType;
  subject: LessonOneSubject;
  verb: Verb;
}) {
  return `${verb.id}-${subject.value}-present-${sentenceType}`;
}

function parseLessonOneTaskId(taskId: string) {
  const [verbId, subjectValue, , rawSentenceType] = taskId.split('-');

  if (!isLessonOneSentenceType(rawSentenceType) || !verbId || !subjectValue) {
    return null;
  }

  return {
    sentenceType: rawSentenceType,
    subjectValue,
    verbId,
  };
}

function isLessonOneSentenceType(
  value: string | undefined,
): value is LessonOneSentenceType {
  return (
    value === 'statement' || value === 'question' || value === 'negative'
  );
}

function getRussianPresentForm({
  subject,
  verb,
}: {
  subject: LessonOneSubject;
  verb: Verb;
}) {
  return verb.forms.ru.present[subject.ruKey];
}

function getIsManuallyLearned(verb: Verb) {
  const verbWithLearningStatus = verb as Partial<VerbWithLearningStatus>;

  return Boolean(
    verbWithLearningStatus.isManuallyLearned ??
      verbWithLearningStatus.isLearned,
  );
}

function getIsAutoLearned(verb: Verb) {
  const verbWithLearningStatus = verb as Partial<VerbWithLearningStatus>;

  return Boolean(verbWithLearningStatus.isAutoLearned);
}

function createGenerationConfig(
  config: Partial<LessonOneTaskGenerationConfig> | undefined,
) {
  return {
    ...DEFAULT_LESSON_ONE_TASK_GENERATION_CONFIG,
    ...config,
  };
}

function getPercent(value: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

function clampRandomValue(value: number) {
  if (Number.isNaN(value)) {
    return 0;
  }

  return Math.min(Math.max(value, 0), 0.999999999);
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
