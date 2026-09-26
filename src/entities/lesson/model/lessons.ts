import { routes } from '@/shared/config/routes';

export const LESSON_COUNT = 16;

export type Lesson = {
  id: number;
  title: string;
  routePath: string;
  summary: string;
};

export type LessonDetail = {
  lessonId: number;
  title: string;
  paragraphs: string[];
  formula?: LessonFormula;
  topics: string[];
};

export type LessonFormula = {
  title: string;
  lead: string;
  items: LessonFormulaItem[];
  ruleBlocks: LessonFormulaRuleBlock[];
};

export type LessonFormulaItem = {
  tense: string;
  marker: string;
  question: string;
  statement: string;
  negative: string;
  note: string;
};

export type LessonFormulaRuleBlock = {
  title: string;
  items: string[];
};

export const lessons: Lesson[] = Array.from({ length: LESSON_COUNT }, (_, index) => {
  const id = index + 1;

  return {
    id,
    title: `Lesson ${id}`,
    routePath: routes.lesson(id),
    summary: `Draft screen for lesson ${id}.`,
  };
});

export const lessonDetails: LessonDetail[] = [
  {
    lessonId: 1,
    title: 'Урок 1: базовая таблица глагола',
    paragraphs: [
      'Главная цель первого урока — довести до автоматизма простую схему английского предложения: кто делает действие и какой глагол нужно поставить.',
      'Сейчас тренажер показывает короткую русскую фразу в настоящем времени. Введите английский перевод и отправьте форму. После этого появится правильный ответ, а следующий Enter откроет новую фразу.',
    ],
    formula: {
      title: 'Формула предложений',
      lead: 'В этой таблице V означает базовую форму смыслового глагола: have, go, use, make.',
      items: [
        {
          tense: 'Present Simple',
          marker: 'обычно, регулярно, сейчас как факт',
          question: 'Do / Does + кто + V?',
          statement: 'кто + V / V-s / V-es',
          negative: "кто + don't / doesn't + V",
          note: 'В утверждении добавляй -s/-es только после he, she, it. В вопросе и отрицании после does/doesn’t глагол остается базовым.',
        },
        {
          tense: 'Past Simple',
          marker: 'вчера, раньше, уже случилось',
          question: 'Did + кто + V?',
          statement: 'кто + V-ed / V2',
          negative: "кто + didn't + V",
          note: 'Неправильная форма глагола нужна только в утверждении: went, had, made. После did/didn’t снова ставится базовая форма.',
        },
        {
          tense: 'Future Simple',
          marker: 'потом, завтра, в будущем',
          question: 'Will + кто + V?',
          statement: 'кто + will + V',
          negative: 'кто + will not + V',
          note: 'После will всегда используется базовая форма глагола: will go, will have, will use.',
        },
      ],
      ruleBlocks: [
        {
          title: 'Когда добавлять -s или -es',
          items: [
            'Только в утвердительном Present Simple после he, she, it: he works, she uses.',
            'Обычно добавляется -s: love → loves, make → makes.',
            'После -s, -sh, -ch, -x, -o добавляется -es: watch → watches, go → goes.',
            'Если глагол заканчивается на согласную + y, y меняется на -ies: try → tries.',
          ],
        },
        {
          title: 'Где нужна неправильная форма',
          items: [
            'Только в утвердительном Past Simple: I went, she had, they made.',
            'В вопросах и отрицаниях Past Simple работает did/didn’t, поэтому смысловой глагол возвращается в базовую форму: Did she go? She didn’t go.',
          ],
        },
      ],
    },
    topics: [
      'утверждения, вопросы и отрицания в Present Simple',
      'do/does как вспомогательные элементы',
      '-s/-es у глагола после he/she/it',
      'глаголы из словаря, которые еще не отмечены выученными',
    ],
  },
  {
    lessonId: 2,
    title: 'Урок 2: местоимения и вопросительные слова',
    paragraphs: [
      'Черновик будущей справки. Урок расширяет базовые фразы объектами действия и вопросительными словами.',
    ],
    topics: [
      'субъектные и объектные местоимения',
      'what, where, when, why, who, how',
      'вопросительное слово перед базовой вопросительной схемой',
      'предлоги to, from, in',
    ],
  },
  {
    lessonId: 3,
    title: 'Урок 3: глагол to be',
    paragraphs: [
      'Черновик будущей справки. Урок отделяет to be от обычных смысловых глаголов и тренирует фразы состояния, места и роли.',
    ],
    topics: [
      'am/is/are, was/were, will be',
      'вопросы без do/does/did',
      'отрицания с not',
      'разница между to be и смысловым глаголом',
    ],
  },
  {
    lessonId: 4,
    title: 'Урок 4: рассказ о себе и артикли',
    paragraphs: [
      'Черновик будущей справки. Урок переводит базовые конструкции в бытовой разговор о себе, работе и профессии.',
    ],
    topics: [
      'вопросы о профессии и работе',
      'work in, work as, be at',
      'a/an/the на базовом уровне',
      'мини-диалоги знакомства',
    ],
  },
  {
    lessonId: 5,
    title: 'Урок 5: прилагательные и сравнение',
    paragraphs: [
      'Черновик будущей справки. Урок добавляет описания, сравнения и временные маркеры.',
    ],
    topics: [
      'простые прилагательные',
      'сравнительная степень через -er и more',
      'превосходная степень через the -est и the most',
      'than, дни недели, месяцы и предлоги времени',
    ],
  },
  {
    lessonId: 6,
    title: 'Урок 6: количество',
    paragraphs: [
      'Черновик будущей справки. Урок разбирает количество и различие исчисляемых и неисчисляемых существительных.',
    ],
    topics: [
      'many/few для исчисляемого',
      'much/little для неисчисляемого',
      'a lot of как универсальная конструкция',
      'how many и how much',
    ],
  },
  {
    lessonId: 7,
    title: 'Урок 7: закрепление и команды',
    paragraphs: [
      'Черновик будущей справки. Урок работает как checkpoint по базе и добавляет повелительное наклонение.',
    ],
    topics: [
      'смешанные задания по урокам 1-6',
      'команды с глаголом в начале',
      "отрицательные команды через don't",
      'выбор времени по контексту',
    ],
  },
  {
    lessonId: 8,
    title: 'Урок 8: предлоги и послелоги',
    paragraphs: [
      'Черновик будущей справки. Урок систематизирует пространственные и смысловые связи через предлоги.',
    ],
    topics: [
      'предлоги места и направления',
      'движение и положение',
      'простые фразовые глаголы',
      'выбор предлога по ситуации',
    ],
  },
  {
    lessonId: 9,
    title: 'Урок 9: возвратные местоимения',
    paragraphs: [
      'Черновик будущей справки. Урок вводит myself, yourself и другие формы для действий, направленных на самого действующего.',
    ],
    topics: [
      'myself, yourself, himself, herself, itself',
      'ourselves, yourselves, themselves',
      'объектное или возвратное местоимение',
      'значения себя, сам и -ся',
    ],
  },
  {
    lessonId: 10,
    title: 'Урок 10: практика общения',
    paragraphs: [
      'Черновик будущей справки. Урок переводит отдельные предложения в короткие истории и ответы о событиях.',
    ],
    topics: [
      'вопросы о недавних событиях',
      'ответы в Past Simple',
      'сборка короткой истории',
      'личные фразы о себе',
    ],
  },
  {
    lessonId: 11,
    title: 'Урок 11: Continuous и третья форма',
    paragraphs: [
      'Черновик будущей справки. Урок вводит процессные времена и готовит базу для Perfect и Passive.',
    ],
    topics: [
      'Present/Past/Future Continuous',
      'формула to be + V-ing',
      'факт или процесс',
      'base, past, third form, ing form',
    ],
  },
  {
    lessonId: 12,
    title: 'Урок 12: числительные и даты',
    paragraphs: [
      'Черновик будущей справки. Урок посвящен количественным и порядковым числительным, составным числам и датам.',
    ],
    topics: [
      'количественные числительные',
      'порядковые числительные',
      '-teen, -ty, -th',
      'даты и составные числа',
    ],
  },
  {
    lessonId: 13,
    title: 'Урок 13: модальные глаголы и let',
    paragraphs: [
      'Черновик будущей справки. Урок добавляет отношение к действию: могу, должен, следует, нельзя.',
    ],
    topics: [
      'can/could, should/shouldn’t, must/mustn’t',
      'modal + verb без to',
      'вопросы и отрицания с модальными глаголами',
      "let, let's и let's not",
    ],
  },
  {
    lessonId: 14,
    title: 'Урок 14: условия и вопрос к подлежащему',
    paragraphs: [
      'Черновик будущей справки. Урок разбирает условные предложения первого типа и вопросы к подлежащему.',
    ],
    topics: [
      'if/when + Present Simple',
      'главная часть с will',
      'ошибка if I will',
      'who/what как вопрос к подлежащему',
    ],
  },
  {
    lessonId: 15,
    title: 'Урок 15: there is / there are',
    paragraphs: [
      'Черновик будущей справки. Урок тренирует перестройку русских фраз вида «в комнате есть...» в английскую структуру с there.',
    ],
    topics: [
      'there is и there are',
      'there was/were',
      'there will be',
      'вопросы и отрицания',
    ],
  },
  {
    lessonId: 16,
    title: 'Урок 16: пассивный залог',
    paragraphs: [
      'Черновик будущей справки. Урок завершает курс пассивным залогом и переносит фокус с действующего на объект и результат.',
    ],
    topics: [
      'to be + past participle',
      'форма to be по времени',
      'третья форма неправильных глаголов',
      'by для исполнителя и with для инструмента',
    ],
  },
];

export function getLessonById(lessonId: number) {
  return lessons.find((lesson) => lesson.id === lessonId);
}

export function getLessonDetailById(lessonId: number) {
  return lessonDetails.find((lessonDetail) => lessonDetail.lessonId === lessonId);
}
