import { beforeEach, describe, expect, it } from 'vitest';

import { COMMON_ENGLISH_VERBS } from '../model/common-verbs';
import { verbsApi } from './verbs-api';

describe('интерфейс глаголов', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('возвращает 100 захардкоженных частотных глаголов с уникальными идентификаторами', () => {
    const ids = new Set(COMMON_ENGLISH_VERBS.map((verb) => verb.id));

    expect(COMMON_ENGLISH_VERBS).toHaveLength(100);
    expect(ids.size).toBe(100);
  });

  it('хранит русский инфинитив и формы настоящего времени в данных глагола', () => {
    expect(
      COMMON_ENGLISH_VERBS.every(
        (verb) =>
          verb.russian.infinitive.length > 0 &&
          verb.forms.ru.present.firstPersonSingular.length > 0 &&
          verb.forms.ru.present.secondPerson.length > 0 &&
          verb.forms.ru.present.firstPersonPlural.length > 0 &&
          verb.forms.ru.present.thirdPersonPlural.length > 0 &&
          verb.forms.ru.present.thirdPerson.length > 0 &&
          verb.forms.ru.past.firstSecondPerson.length > 0 &&
          verb.forms.ru.past.masculine.length > 0 &&
          verb.forms.ru.past.feminine.length > 0 &&
          verb.forms.ru.past.plural.length > 0,
      ),
    ).toBe(true);
  });

  it('хранит ручные русские формы для глаголов, которые нельзя вывести механически', () => {
    const expectedFormsByVerbId = {
      appear: ['появляюсь', 'появляешься', 'появляется', 'появляемся', 'появляются'],
      become: ['становлюсь', 'становишься', 'становится', 'становимся', 'становятся'],
      bring: ['приношу', 'приносишь', 'приносит', 'приносим', 'приносят'],
      carry: ['несу', 'несешь', 'несет', 'несем', 'несут'],
      come: ['прихожу', 'приходишь', 'приходит', 'приходим', 'приходят'],
      cut: ['режу', 'режешь', 'режет', 'режем', 'режут'],
      find: ['нахожу', 'находишь', 'находит', 'находим', 'находят'],
      go: ['иду', 'идешь', 'идет', 'идем', 'идут'],
      grow: ['расту', 'растешь', 'растет', 'растем', 'растут'],
      hear: ['слышу', 'слышишь', 'слышит', 'слышим', 'слышат'],
      hope: ['надеюсь', 'надеешься', 'надеется', 'надеемся', 'надеются'],
      keep: ['держу', 'держишь', 'держит', 'держим', 'держат'],
      lead: ['веду', 'ведешь', 'ведет', 'ведем', 'ведут'],
      leave: ['ухожу', 'уходишь', 'уходит', 'уходим', 'уходят'],
      live: ['живу', 'живешь', 'живет', 'живем', 'живут'],
      love: ['люблю', 'любишь', 'любит', 'любим', 'любят'],
      mean: ['значу', 'значишь', 'значит', 'значим', 'значат'],
      move: ['двигаюсь', 'двигаешься', 'двигается', 'двигаемся', 'двигаются'],
      need: ['нуждаюсь', 'нуждаешься', 'нуждается', 'нуждаемся', 'нуждаются'],
      pass: ['прохожу', 'проходишь', 'проходит', 'проходим', 'проходят'],
      pay: ['плачу', 'платишь', 'платит', 'платим', 'платят'],
      pull: ['тяну', 'тянешь', 'тянет', 'тянем', 'тянут'],
      put: ['кладу', 'кладешь', 'кладет', 'кладем', 'кладут'],
      return: ['возвращаюсь', 'возвращаешься', 'возвращается', 'возвращаемся', 'возвращаются'],
      run: ['бегу', 'бежишь', 'бежит', 'бежим', 'бегут'],
      see: ['вижу', 'видишь', 'видит', 'видим', 'видят'],
      seem: ['кажусь', 'кажешься', 'кажется', 'кажемся', 'кажутся'],
      serve: ['служу', 'служишь', 'служит', 'служим', 'служат'],
      sit: ['сижу', 'сидишь', 'сидит', 'сидим', 'сидят'],
      spend: ['трачу', 'тратишь', 'тратит', 'тратим', 'тратят'],
      stay: ['остаюсь', 'остаешься', 'остается', 'остаемся', 'остаются'],
      take: ['беру', 'берешь', 'берет', 'берем', 'берут'],
      try: ['пытаюсь', 'пытаешься', 'пытается', 'пытаемся', 'пытаются'],
      wait: ['жду', 'ждешь', 'ждет', 'ждем', 'ждут'],
      walk: ['хожу', 'ходишь', 'ходит', 'ходим', 'ходят'],
      want: ['хочу', 'хочешь', 'хочет', 'хотим', 'хотят'],
      write: ['пишу', 'пишешь', 'пишет', 'пишем', 'пишут'],
    } as const;

    Object.entries(expectedFormsByVerbId).forEach(([verbId, expectedForms]) => {
      const verb = COMMON_ENGLISH_VERBS.find(
        (currentVerb) => currentVerb.id === verbId,
      );

      expect(verb?.forms.ru.present).toEqual({
        firstPersonSingular: expectedForms[0],
        secondPerson: expectedForms[1],
        thirdPerson: expectedForms[2],
        firstPersonPlural: expectedForms[3],
        thirdPersonPlural: expectedForms[4],
      });
    });
  });

  it('помечает глагол как выученный вручную и исключает его из тренировки', async () => {
    await verbsApi.setVerbLearningStatus({
      verbId: 'have',
      isLearned: true,
    });

    const verbs = await verbsApi.getVerbs();
    const practiceVerbs = await verbsApi.getPracticeVerbs();

    expect(verbs.find((verb) => verb.id === 'have')?.isLearned).toBe(true);
    expect(verbs.find((verb) => verb.id === 'have')?.isManuallyLearned).toBe(
      true,
    );
    expect(verbs.find((verb) => verb.id === 'have')?.isAutoLearned).toBe(false);
    expect(practiceVerbs.some((verb) => verb.id === 'have')).toBe(false);
  });

  it('возвращает вручную выученный глагол в тренировку после снятия отметки', async () => {
    await verbsApi.setVerbLearningStatus({
      verbId: 'have',
      isLearned: true,
    });
    await verbsApi.setVerbLearningStatus({
      verbId: 'have',
      isLearned: false,
    });

    const practiceVerbs = await verbsApi.getPracticeVerbs();

    expect(practiceVerbs.some((verb) => verb.id === 'have')).toBe(true);
  });
});
