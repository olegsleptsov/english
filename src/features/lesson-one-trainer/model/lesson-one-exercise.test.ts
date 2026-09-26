import { describe, expect, it } from 'vitest';

import type { LessonAnalytics } from '@/entities/lesson-analytics';
import { COMMON_ENGLISH_VERBS, type Verb } from '@/entities/verb';

import {
  applyLessonOneAutoLearningStatus,
  createLessonOneProgressFromAnalytics,
  createLessonOneTask,
  getLessonOnePracticeWindow,
  isLessonOneAnswerCorrect,
  isLessonOneVerbAutoLearned,
  type LessonOneSentenceType,
} from './lesson-one-exercise';
import {
  AUTO_LEARNED_CORRECT_COUNT,
  AUTO_LEARNED_MIN_ACCURACY,
  AUTO_LEARNED_MIN_CORRECT_BY_SENTENCE_TYPE,
  LESSON_ONE_VERB_WINDOW_SIZE,
} from './lesson-one-constants';

describe('модель заданий первого урока', () => {
  it('создает русскую фразу и английский ответ для утверждения', () => {
    const task = createLessonOneTask({
      rng: createRngSequence([0, 0, 0]),
      verbs: getVerbsByIds(['have']),
    });

    expect(task?.prompt).toBe('Я имею');
    expect(task?.expectedAnswer).toBe('I have');
    expect(task?.id).toBe('have-I-present-statement');
  });

  it('создает вопросительную конструкцию в настоящем простом времени', () => {
    const task = createLessonOneTask({
      rng: createRngSequence([0, 0.4, 0]),
      verbs: getVerbsByIds(['have']),
    });

    expect(task?.prompt).toBe('Я имею?');
    expect(task?.expectedAnswer).toBe('Do I have?');
    expect(task?.id).toBe('have-I-present-question');
  });

  it('создает отрицательную конструкцию со вспомогательным глаголом для третьего лица', () => {
    const task = createLessonOneTask({
      rng: createRngSequence([0, 0.8, 0.4]),
      verbs: getVerbsByIds(['have']),
    });

    expect(task?.prompt).toBe('Он не имеет');
    expect(task?.expectedAnswer).toBe('he does not have');
    expect(task?.id).toBe('have-he-present-negative');
  });

  it('принимает ответ без финальной пунктуации и с другим регистром', () => {
    expect(isLessonOneAnswerCorrect('  DO I HAVE? ', 'Do I have?')).toBe(true);
  });

  it("принимает don't, если правильный ответ записан как do not", () => {
    expect(isLessonOneAnswerCorrect("you don't say", 'you do not say')).toBe(
      true,
    );
  });

  it("принимает do not, если правильный ответ записан как don't", () => {
    expect(isLessonOneAnswerCorrect('you do not say', "you don't say")).toBe(
      true,
    );
  });

  it("принимает doesn't вместо does not в ответе первого урока", () => {
    expect(
      isLessonOneAnswerCorrect("he doesn't have", 'he does not have'),
    ).toBe(true);
  });

  it('принимает похожие отрицательные сокращения для будущих уроков', () => {
    expect(isLessonOneAnswerCorrect("I won't go", 'I will not go')).toBe(true);
    expect(isLessonOneAnswerCorrect("we can't wait", 'we cannot wait')).toBe(
      true,
    );
  });

  it('не создает задания для глаголов, несовместимых с первым уроком', () => {
    const task = createLessonOneTask({
      rng: createRngSequence([0, 0, 0]),
      verbs: getVerbsByIds(['be']),
    });

    expect(task).toBeNull();
  });

  it('берет в тренировку только доступные глаголы из скользящего окна', () => {
    const verbs = getFirstLessonCompatibleVerbs(
      LESSON_ONE_VERB_WINDOW_SIZE + 1,
    );
    const practiceWindow = getLessonOnePracticeWindow({ verbs });

    expect(practiceWindow).toHaveLength(LESSON_ONE_VERB_WINDOW_SIZE);
    expect(practiceWindow.map((verb) => verb.id)).not.toContain(
      verbs[LESSON_ONE_VERB_WINDOW_SIZE].id,
    );
  });

  it('добирает следующий глагол в окно, если первый глагол выучен вручную', () => {
    const verbs = getFirstLessonCompatibleVerbs(
      LESSON_ONE_VERB_WINDOW_SIZE + 1,
    ).map((verb, index) =>
      index === 0
        ? {
            ...verb,
            isAutoLearned: false,
            isLearned: true,
            isManuallyLearned: true,
          }
        : verb,
    );
    const practiceWindow = getLessonOnePracticeWindow({ verbs });

    expect(practiceWindow.map((verb) => verb.id)).not.toContain(verbs[0].id);
    expect(practiceWindow.map((verb) => verb.id)).toContain(
      verbs[LESSON_ONE_VERB_WINDOW_SIZE].id,
    );
  });

  it('исключает глагол из окна, если программа считает его освоенным', () => {
    const verbs = getFirstLessonCompatibleVerbs(
      LESSON_ONE_VERB_WINDOW_SIZE + 1,
    );
    const progress = createProgress({
      verbId: verbs[0].id,
      sentenceCorrect: createMasteredSentenceCorrect(),
      incorrect: 2,
    });
    const practiceWindow = getLessonOnePracticeWindow({ progress, verbs });

    expect(practiceWindow.map((verb) => verb.id)).not.toContain(verbs[0].id);
    expect(practiceWindow.map((verb) => verb.id)).toContain(
      verbs[LESSON_ONE_VERB_WINDOW_SIZE].id,
    );
  });

  it('не считает глагол освоенным без достаточного числа попыток', () => {
    const sentenceCorrect = createMasteredSentenceCorrect();
    const progress = createProgress({
      verbId: 'have',
      sentenceCorrect,
      incorrect: 0,
    });

    expect(
      isLessonOneVerbAutoLearned({
        config: {
          autoLearnedMinAttempts: getCorrectCount(sentenceCorrect) + 1,
        },
        progress,
        verbId: 'have',
      }),
    ).toBe(false);
  });

  it('не считает глагол освоенным при точности ниже минимального порога', () => {
    const sentenceCorrect = createMasteredSentenceCorrect();
    const progress = createProgress({
      verbId: 'have',
      sentenceCorrect,
      incorrect: getIncorrectCountBelowMinAccuracy(
        getCorrectCount(sentenceCorrect),
      ),
    });

    expect(
      isLessonOneVerbAutoLearned({
        progress,
        verbId: 'have',
      }),
    ).toBe(false);
  });

  it('не считает глагол освоенным без двух правильных ответов на каждый тип конструкции', () => {
    const requiredCoverage = AUTO_LEARNED_MIN_CORRECT_BY_SENTENCE_TYPE + 1;
    const progress = createProgress({
      verbId: 'have',
      sentenceCorrect: createSentenceCorrectWithoutRequiredCoverage(
        requiredCoverage,
      ),
      incorrect: 2,
    });

    expect(
      isLessonOneVerbAutoLearned({
        config: {
          autoLearnedMinCorrectBySentenceType: requiredCoverage,
        },
        progress,
        verbId: 'have',
      }),
    ).toBe(false);
  });

  it('считает глагол освоенным, когда выполнены все критерии авто-освоения', () => {
    const progress = createProgress({
      verbId: 'have',
      sentenceCorrect: createMasteredSentenceCorrect(),
      incorrect: 2,
    });

    expect(
      isLessonOneVerbAutoLearned({
        progress,
        verbId: 'have',
      }),
    ).toBe(true);
  });

  it('добавляет к глаголам отдельный автоматический статус и не трогает ручной статус', () => {
    const progress = createProgress({
      verbId: 'have',
      sentenceCorrect: createMasteredSentenceCorrect(),
      incorrect: 2,
    });
    const [have, doVerb] = applyLessonOneAutoLearningStatus(
      getVerbsByIds(['have', 'do']).map((verb) =>
        verb.id === 'do'
          ? {
              ...verb,
              isAutoLearned: false,
              isLearned: true,
              isManuallyLearned: true,
            }
          : verb,
      ),
      progress,
    );

    expect(have.isAutoLearned).toBe(true);
    expect(have.isManuallyLearned).toBe(false);
    expect(have.isLearned).toBe(true);
    expect(doVerb.isAutoLearned).toBe(false);
    expect(doVerb.isManuallyLearned).toBe(true);
    expect(doVerb.isLearned).toBe(true);
  });

  it('выбирает глагол с ошибками чаще обычного, если случайное значение попадает в его весовой интервал', () => {
    const task = createLessonOneTask({
      progress: createProgress({
        verbId: 'do',
        sentenceCorrect: {
          negative: 0,
          question: 0,
          statement: 0,
        },
        incorrect: 6,
      }),
      rng: createRngSequence([0.5, 0, 0]),
      verbs: getVerbsByIds(['have', 'do']),
    });

    expect(task?.verb.id).toBe('do');
  });

  it('собирает компактный прогресс из полной аналитики урока для будущего контракта сервера', () => {
    const progress = createLessonOneProgressFromAnalytics(
      createAnalytics({
        verbId: 'have',
        sentenceCorrect: {
          negative: 4,
          question: 2,
          statement: 2,
        },
        incorrect: 2,
      }),
    );

    expect(progress.have).toMatchObject({
      correct: 8,
      incorrect: 2,
      shownCount: 10,
    });
    expect(progress.have.sentenceTypes.statement).toEqual({
      correct: 2,
      incorrect: 2,
    });
    expect(progress.have.sentenceTypes.question).toEqual({
      correct: 2,
      incorrect: 0,
    });
    expect(progress.have.sentenceTypes.negative).toEqual({
      correct: 4,
      incorrect: 0,
    });
  });

  it('не повторяет предыдущий глагол, если в окне есть другая альтернатива', () => {
    const previousTask = createLessonOneTask({
      rng: createRngSequence([0, 0, 0]),
      verbs: getVerbsByIds(['have', 'do']),
    });
    const nextTask = createLessonOneTask({
      previousTask,
      rng: createRngSequence([0, 0, 0]),
      verbs: getVerbsByIds(['have', 'do']),
    });

    expect(previousTask?.verb.id).toBe('have');
    expect(nextTask?.verb.id).toBe('do');
  });
});

function getVerbsByIds(ids: string[]) {
  return ids.map((id) => {
    const verb = COMMON_ENGLISH_VERBS.find((currentVerb) => currentVerb.id === id);

    if (!verb) {
      throw new Error(`Verb "${id}" was not found.`);
    }

    return verb;
  });
}

function getFirstLessonCompatibleVerbs(limit: number) {
  return COMMON_ENGLISH_VERBS.filter((verb) => verb.lessonOneCompatible).slice(
    0,
    limit,
  );
}

function createRngSequence(values: number[]) {
  let index = 0;

  return () => values[index++] ?? 0;
}

function createMasteredSentenceCorrect() {
  const minimumBySentenceType = AUTO_LEARNED_MIN_CORRECT_BY_SENTENCE_TYPE;
  const sentenceCorrect = {
    negative: minimumBySentenceType,
    question: minimumBySentenceType,
    statement: minimumBySentenceType,
  };
  const targetCorrect = Math.max(
    AUTO_LEARNED_CORRECT_COUNT,
    minimumBySentenceType * 3,
  );

  sentenceCorrect.negative += targetCorrect - getCorrectCount(sentenceCorrect);

  return sentenceCorrect;
}

function createSentenceCorrectWithoutRequiredCoverage(requiredCoverage: number) {
  const missingCoverage = Math.max(requiredCoverage - 1, 0);
  const sentenceCorrect = {
    negative: missingCoverage,
    question: requiredCoverage,
    statement: requiredCoverage,
  };
  const targetCorrect = Math.max(AUTO_LEARNED_CORRECT_COUNT, requiredCoverage * 3);

  sentenceCorrect.statement += targetCorrect - getCorrectCount(sentenceCorrect);

  return sentenceCorrect;
}

function getIncorrectCountBelowMinAccuracy(correct: number) {
  if (AUTO_LEARNED_MIN_ACCURACY <= 0) {
    return 1;
  }

  return Math.max(
    1,
    Math.floor((correct * 100) / AUTO_LEARNED_MIN_ACCURACY - correct) + 1,
  );
}

function getCorrectCount(
  sentenceCorrect: Record<LessonOneSentenceType, number>,
) {
  return (
    sentenceCorrect.statement +
    sentenceCorrect.question +
    sentenceCorrect.negative
  );
}

function createProgress({
  incorrect = 0,
  sentenceCorrect,
  verbId,
}: {
  verbId: string;
  sentenceCorrect: Record<LessonOneSentenceType, number>;
  incorrect?: number;
}) {
  return createLessonOneProgressFromAnalytics(
    createAnalytics({ incorrect, sentenceCorrect, verbId }),
  );
}

function createAnalytics({
  incorrect = 0,
  sentenceCorrect,
  verbId,
}: {
  verbId: string;
  sentenceCorrect: Record<LessonOneSentenceType, number>;
  incorrect?: number;
}): LessonAnalytics {
  const tasks = createTaskStats({ incorrect, sentenceCorrect, verbId });
  const correct =
    sentenceCorrect.statement +
    sentenceCorrect.question +
    sentenceCorrect.negative;
  const shownCount = correct + incorrect;

  return {
    daily: {
      '2026-09-26': {
        correct,
        date: '2026-09-26',
        incorrect,
      },
    },
    lessonId: 1,
    tasks,
    totals: {
      correct,
      incorrect,
    },
    updatedAt: '2026-09-26T10:00:00.000Z',
    verbs: {
      [verbId]: {
        correct,
        daily: {
          '2026-09-26': {
            correct,
            date: '2026-09-26',
            incorrect,
            shownCount,
          },
        },
        incorrect,
        lastAnsweredAt: '2026-09-26T10:00:00.000Z',
        shownCount,
        verbId,
      },
    },
  };
}

function createTaskStats({
  incorrect,
  sentenceCorrect,
  verbId,
}: {
  verbId: string;
  sentenceCorrect: Record<LessonOneSentenceType, number>;
  incorrect: number;
}) {
  return {
    [`${verbId}-I-present-statement`]: createTask({
      correct: sentenceCorrect.statement,
      incorrect,
      sentenceType: 'statement',
      verbId,
    }),
    [`${verbId}-I-present-question`]: createTask({
      correct: sentenceCorrect.question,
      incorrect: 0,
      sentenceType: 'question',
      verbId,
    }),
    [`${verbId}-I-present-negative`]: createTask({
      correct: sentenceCorrect.negative,
      incorrect: 0,
      sentenceType: 'negative',
      verbId,
    }),
  };
}

function createTask({
  correct,
  incorrect,
  sentenceType,
  verbId,
}: {
  verbId: string;
  sentenceType: LessonOneSentenceType;
  correct: number;
  incorrect: number;
}) {
  return {
    correct,
    incorrect,
    shownCount: correct + incorrect,
    taskId: `${verbId}-I-present-${sentenceType}`,
    verbId,
  };
}
