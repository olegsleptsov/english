import type { Verb } from './types';

export const COMMON_ENGLISH_VERBS: Verb[] = [
  createVerb(1, 'be', 'is', 'was/were', 'been', 'being', 'быть', true, false),
  createVerb(2, 'have', 'has', 'had', 'had', 'having', 'иметь', true),
  createVerb(3, 'do', 'does', 'did', 'done', 'doing', 'делать', true),
  createVerb(4, 'say', 'says', 'said', 'said', 'saying', 'говорить', true),
  createVerb(5, 'go', 'goes', 'went', 'gone', 'going', 'идти', true),
  createVerb(6, 'get', 'gets', 'got', 'got/gotten', 'getting', 'получать', true),
  createVerb(7, 'make', 'makes', 'made', 'made', 'making', 'делать/создавать', true),
  createVerb(8, 'know', 'knows', 'knew', 'known', 'knowing', 'знать', true),
  createVerb(9, 'think', 'thinks', 'thought', 'thought', 'thinking', 'думать', true),
  createVerb(10, 'take', 'takes', 'took', 'taken', 'taking', 'брать', true),
  createVerb(11, 'see', 'sees', 'saw', 'seen', 'seeing', 'видеть', true),
  createVerb(12, 'come', 'comes', 'came', 'come', 'coming', 'приходить', true),
  createVerb(13, 'want', 'wants', 'wanted', 'wanted', 'wanting', 'хотеть'),
  createVerb(14, 'use', 'uses', 'used', 'used', 'using', 'использовать'),
  createVerb(15, 'find', 'finds', 'found', 'found', 'finding', 'находить', true),
  createVerb(16, 'give', 'gives', 'gave', 'given', 'giving', 'давать', true),
  createVerb(17, 'tell', 'tells', 'told', 'told', 'telling', 'рассказывать', true),
  createVerb(18, 'work', 'works', 'worked', 'worked', 'working', 'работать'),
  createVerb(19, 'call', 'calls', 'called', 'called', 'calling', 'звонить/называть'),
  createVerb(20, 'try', 'tries', 'tried', 'tried', 'trying', 'пытаться'),
  createVerb(21, 'ask', 'asks', 'asked', 'asked', 'asking', 'спрашивать'),
  createVerb(22, 'need', 'needs', 'needed', 'needed', 'needing', 'нуждаться'),
  createVerb(23, 'feel', 'feels', 'felt', 'felt', 'feeling', 'чувствовать', true),
  createVerb(24, 'become', 'becomes', 'became', 'become', 'becoming', 'становиться', true),
  createVerb(25, 'leave', 'leaves', 'left', 'left', 'leaving', 'оставлять/уходить', true),
  createVerb(26, 'put', 'puts', 'put', 'put', 'putting', 'класть', true),
  createVerb(27, 'mean', 'means', 'meant', 'meant', 'meaning', 'значить', true),
  createVerb(28, 'keep', 'keeps', 'kept', 'kept', 'keeping', 'держать/сохранять', true),
  createVerb(29, 'let', 'lets', 'let', 'let', 'letting', 'позволять', true),
  createVerb(30, 'begin', 'begins', 'began', 'begun', 'beginning', 'начинать', true),
  createVerb(31, 'seem', 'seems', 'seemed', 'seemed', 'seeming', 'казаться'),
  createVerb(32, 'help', 'helps', 'helped', 'helped', 'helping', 'помогать'),
  createVerb(33, 'talk', 'talks', 'talked', 'talked', 'talking', 'разговаривать'),
  createVerb(34, 'turn', 'turns', 'turned', 'turned', 'turning', 'поворачивать'),
  createVerb(35, 'start', 'starts', 'started', 'started', 'starting', 'начинать'),
  createVerb(36, 'show', 'shows', 'showed', 'shown', 'showing', 'показывать', true),
  createVerb(37, 'hear', 'hears', 'heard', 'heard', 'hearing', 'слышать', true),
  createVerb(38, 'play', 'plays', 'played', 'played', 'playing', 'играть'),
  createVerb(39, 'run', 'runs', 'ran', 'run', 'running', 'бежать', true),
  createVerb(40, 'move', 'moves', 'moved', 'moved', 'moving', 'двигаться'),
  createVerb(41, 'live', 'lives', 'lived', 'lived', 'living', 'жить'),
  createVerb(42, 'believe', 'believes', 'believed', 'believed', 'believing', 'верить'),
  createVerb(43, 'bring', 'brings', 'brought', 'brought', 'bringing', 'приносить', true),
  createVerb(44, 'write', 'writes', 'wrote', 'written', 'writing', 'писать', true),
  createVerb(45, 'sit', 'sits', 'sat', 'sat', 'sitting', 'сидеть', true),
  createVerb(46, 'stand', 'stands', 'stood', 'stood', 'standing', 'стоять', true),
  createVerb(47, 'lose', 'loses', 'lost', 'lost', 'losing', 'терять', true),
  createVerb(48, 'pay', 'pays', 'paid', 'paid', 'paying', 'платить', true),
  createVerb(49, 'meet', 'meets', 'met', 'met', 'meeting', 'встречать', true),
  createVerb(50, 'include', 'includes', 'included', 'included', 'including', 'включать'),
  createVerb(51, 'continue', 'continues', 'continued', 'continued', 'continuing', 'продолжать'),
  createVerb(52, 'set', 'sets', 'set', 'set', 'setting', 'устанавливать', true),
  createVerb(53, 'learn', 'learns', 'learned/learnt', 'learned/learnt', 'learning', 'учить/изучать', true),
  createVerb(54, 'change', 'changes', 'changed', 'changed', 'changing', 'менять'),
  createVerb(55, 'lead', 'leads', 'led', 'led', 'leading', 'вести', true),
  createVerb(56, 'understand', 'understands', 'understood', 'understood', 'understanding', 'понимать', true),
  createVerb(57, 'watch', 'watches', 'watched', 'watched', 'watching', 'смотреть'),
  createVerb(58, 'follow', 'follows', 'followed', 'followed', 'following', 'следовать'),
  createVerb(59, 'stop', 'stops', 'stopped', 'stopped', 'stopping', 'останавливать'),
  createVerb(60, 'create', 'creates', 'created', 'created', 'creating', 'создавать'),
  createVerb(61, 'speak', 'speaks', 'spoke', 'spoken', 'speaking', 'говорить', true),
  createVerb(62, 'read', 'reads', 'read', 'read', 'reading', 'читать', true),
  createVerb(63, 'allow', 'allows', 'allowed', 'allowed', 'allowing', 'позволять'),
  createVerb(64, 'add', 'adds', 'added', 'added', 'adding', 'добавлять'),
  createVerb(65, 'spend', 'spends', 'spent', 'spent', 'spending', 'тратить/проводить', true),
  createVerb(66, 'grow', 'grows', 'grew', 'grown', 'growing', 'расти', true),
  createVerb(67, 'open', 'opens', 'opened', 'opened', 'opening', 'открывать'),
  createVerb(68, 'walk', 'walks', 'walked', 'walked', 'walking', 'ходить'),
  createVerb(69, 'win', 'wins', 'won', 'won', 'winning', 'выигрывать', true),
  createVerb(70, 'offer', 'offers', 'offered', 'offered', 'offering', 'предлагать'),
  createVerb(71, 'remember', 'remembers', 'remembered', 'remembered', 'remembering', 'помнить'),
  createVerb(72, 'love', 'loves', 'loved', 'loved', 'loving', 'любить'),
  createVerb(73, 'consider', 'considers', 'considered', 'considered', 'considering', 'считать/рассматривать'),
  createVerb(74, 'appear', 'appears', 'appeared', 'appeared', 'appearing', 'появляться'),
  createVerb(75, 'buy', 'buys', 'bought', 'bought', 'buying', 'покупать', true),
  createVerb(76, 'wait', 'waits', 'waited', 'waited', 'waiting', 'ждать'),
  createVerb(77, 'serve', 'serves', 'served', 'served', 'serving', 'служить'),
  createVerb(78, 'die', 'dies', 'died', 'died', 'dying', 'умирать'),
  createVerb(79, 'send', 'sends', 'sent', 'sent', 'sending', 'отправлять', true),
  createVerb(80, 'expect', 'expects', 'expected', 'expected', 'expecting', 'ожидать'),
  createVerb(81, 'build', 'builds', 'built', 'built', 'building', 'строить', true),
  createVerb(82, 'stay', 'stays', 'stayed', 'stayed', 'staying', 'оставаться'),
  createVerb(83, 'fall', 'falls', 'fell', 'fallen', 'falling', 'падать', true),
  createVerb(84, 'cut', 'cuts', 'cut', 'cut', 'cutting', 'резать', true),
  createVerb(85, 'reach', 'reaches', 'reached', 'reached', 'reaching', 'достигать'),
  createVerb(86, 'kill', 'kills', 'killed', 'killed', 'killing', 'убивать'),
  createVerb(87, 'remain', 'remains', 'remained', 'remained', 'remaining', 'оставаться'),
  createVerb(88, 'suggest', 'suggests', 'suggested', 'suggested', 'suggesting', 'предлагать'),
  createVerb(89, 'raise', 'raises', 'raised', 'raised', 'raising', 'поднимать'),
  createVerb(90, 'pass', 'passes', 'passed', 'passed', 'passing', 'проходить/передавать'),
  createVerb(91, 'sell', 'sells', 'sold', 'sold', 'selling', 'продавать', true),
  createVerb(92, 'require', 'requires', 'required', 'required', 'requiring', 'требовать'),
  createVerb(93, 'report', 'reports', 'reported', 'reported', 'reporting', 'сообщать'),
  createVerb(94, 'decide', 'decides', 'decided', 'decided', 'deciding', 'решать'),
  createVerb(95, 'pull', 'pulls', 'pulled', 'pulled', 'pulling', 'тянуть'),
  createVerb(96, 'return', 'returns', 'returned', 'returned', 'returning', 'возвращаться'),
  createVerb(97, 'explain', 'explains', 'explained', 'explained', 'explaining', 'объяснять'),
  createVerb(98, 'hope', 'hopes', 'hoped', 'hoped', 'hoping', 'надеяться'),
  createVerb(99, 'develop', 'develops', 'developed', 'developed', 'developing', 'развивать'),
  createVerb(100, 'carry', 'carries', 'carried', 'carried', 'carrying', 'нести'),
];

function createVerb(
  rank: number,
  base: string,
  thirdPersonSingular: string,
  pastSimple: string,
  pastParticiple: string,
  presentParticiple: string,
  translation: string,
  isIrregular = false,
  lessonOneCompatible = true,
): Verb {
  const russianPresentForms = createRussianPresentForms(
    getRussianPresentThirdPerson(base, translation),
  );

  return {
    id: base,
    rank,
    base,
    russian: {
      infinitive: translation,
    },
    thirdPersonSingular,
    pastSimple,
    pastParticiple,
    presentParticiple,
    translation,
    forms: {
      ru: {
        present: russianPresentForms,
      },
    },
    isIrregular,
    lessonOneCompatible,
  };
}

function createRussianPresentForms(thirdPerson: string) {
  const irregularForms = getRussianPresentFormsOverride(thirdPerson);

  if (irregularForms) {
    return irregularForms;
  }

  return {
    firstPersonSingular: getRussianFirstPersonSingular(thirdPerson),
    secondPerson: getRussianSecondPerson(thirdPerson),
    thirdPerson,
    firstPersonPlural: getRussianFirstPersonPlural(thirdPerson),
    thirdPersonPlural: getRussianThirdPersonPlural(thirdPerson),
  };
}

function getRussianPresentFormsOverride(thirdPerson: string) {
  const forms: Record<string, ReturnType<typeof createRegularRussianPresentForms>> = {
    имеет: createRegularRussianPresentForms({
      firstPersonSingular: 'имею',
      secondPerson: 'имеешь',
      thirdPerson: 'имеет',
      firstPersonPlural: 'имеем',
      thirdPersonPlural: 'имеют',
    }),
  };

  return forms[thirdPerson];
}

function createRegularRussianPresentForms(forms: {
  firstPersonSingular: string;
  secondPerson: string;
  thirdPerson: string;
  firstPersonPlural: string;
  thirdPersonPlural: string;
}) {
  return forms;
}

function getRussianPresentThirdPerson(base: string, fallback: string) {
  const forms: Record<string, string> = {
    have: 'имеет',
    do: 'делает',
    say: 'говорит',
    go: 'идет',
    get: 'получает',
    make: 'создает',
    know: 'знает',
    think: 'думает',
    take: 'берет',
    see: 'видит',
    come: 'приходит',
    want: 'хочет',
    use: 'использует',
    find: 'находит',
    give: 'дает',
    tell: 'рассказывает',
    work: 'работает',
    call: 'звонит',
    try: 'пытается',
    ask: 'спрашивает',
    need: 'нуждается',
    feel: 'чувствует',
    become: 'становится',
    leave: 'уходит',
    put: 'кладет',
    mean: 'значит',
    keep: 'держит',
    let: 'позволяет',
    begin: 'начинает',
    seem: 'кажется',
    help: 'помогает',
    talk: 'разговаривает',
    turn: 'поворачивает',
    start: 'начинает',
    show: 'показывает',
    hear: 'слышит',
    play: 'играет',
    run: 'бежит',
    move: 'двигается',
    live: 'живет',
    believe: 'верит',
    bring: 'приносит',
    write: 'пишет',
    sit: 'сидит',
    stand: 'стоит',
    lose: 'теряет',
    pay: 'платит',
    meet: 'встречает',
    include: 'включает',
    continue: 'продолжает',
    set: 'устанавливает',
    learn: 'изучает',
    change: 'меняет',
    lead: 'ведет',
    understand: 'понимает',
    watch: 'смотрит',
    follow: 'следует',
    stop: 'останавливает',
    create: 'создает',
    speak: 'говорит',
    read: 'читает',
    allow: 'позволяет',
    add: 'добавляет',
    spend: 'тратит',
    grow: 'растет',
    open: 'открывает',
    walk: 'ходит',
    win: 'выигрывает',
    offer: 'предлагает',
    remember: 'помнит',
    love: 'любит',
    consider: 'считает',
    appear: 'появляется',
    buy: 'покупает',
    wait: 'ждет',
    serve: 'служит',
    die: 'умирает',
    send: 'отправляет',
    expect: 'ожидает',
    build: 'строит',
    stay: 'остается',
    fall: 'падает',
    cut: 'режет',
    reach: 'достигает',
    kill: 'убивает',
    remain: 'остается',
    suggest: 'предлагает',
    raise: 'поднимает',
    pass: 'проходит',
    sell: 'продает',
    require: 'требует',
    report: 'сообщает',
    decide: 'решает',
    pull: 'тянет',
    return: 'возвращается',
    explain: 'объясняет',
    hope: 'надеется',
    develop: 'развивает',
    carry: 'несет',
  };

  return forms[base] ?? fallback;
}

function getRussianFirstPersonSingular(thirdPerson: string) {
  if (thirdPerson.endsWith('ает')) {
    return `${thirdPerson.slice(0, -3)}аю`;
  }

  if (thirdPerson.endsWith('яет')) {
    return `${thirdPerson.slice(0, -3)}яю`;
  }

  if (thirdPerson.endsWith('ует')) {
    return `${thirdPerson.slice(0, -3)}ую`;
  }

  if (thirdPerson.endsWith('ет')) {
    return `${thirdPerson.slice(0, -2)}у`;
  }

  if (thirdPerson.endsWith('ит')) {
    return `${thirdPerson.slice(0, -2)}ю`;
  }

  return thirdPerson;
}

function getRussianSecondPerson(thirdPerson: string) {
  if (thirdPerson.endsWith('ет')) {
    return `${thirdPerson.slice(0, -2)}ешь`;
  }

  if (thirdPerson.endsWith('ит')) {
    return `${thirdPerson.slice(0, -2)}ишь`;
  }

  return thirdPerson;
}

function getRussianFirstPersonPlural(thirdPerson: string) {
  if (thirdPerson.endsWith('ет')) {
    return `${thirdPerson.slice(0, -2)}ем`;
  }

  if (thirdPerson.endsWith('ит')) {
    return `${thirdPerson.slice(0, -2)}им`;
  }

  return thirdPerson;
}

function getRussianThirdPersonPlural(thirdPerson: string) {
  if (thirdPerson.endsWith('ает')) {
    return `${thirdPerson.slice(0, -3)}ают`;
  }

  if (thirdPerson.endsWith('яет')) {
    return `${thirdPerson.slice(0, -3)}яют`;
  }

  if (thirdPerson.endsWith('ует')) {
    return `${thirdPerson.slice(0, -3)}уют`;
  }

  if (thirdPerson.endsWith('ет')) {
    return `${thirdPerson.slice(0, -2)}ют`;
  }

  if (thirdPerson.endsWith('ит')) {
    return `${thirdPerson.slice(0, -2)}ят`;
  }

  return thirdPerson;
}
