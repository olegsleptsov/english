# Polyglot 16 Lessons Context Draft

This file is working domain context for future agents building the frontend trainer for the method commonly known as "Полиглот. Английский за 16 часов" by Dmitry Petrov.

Important:

- This is a paraphrased engineering summary, not a copied transcript or full course replacement.
- Use this file to shape app data, lesson screens, exercise generators, and vocabulary boundaries.
- If exact wording, full exercises, or transcript-level content is needed later, re-check original sources and copyright constraints before importing anything.
- The product target is a practice trainer: it should help users drill constructions, fix grammar patterns, and track progress. It is not meant to republish the full TV course.

## Product Direction

- Primary user flow: choose a lesson, review the active construction, practice phrase assembly, get feedback, and persist progress locally.
- The app remains frontend-only. Treat `localStorage` as a temporary backend through async adapters.
- Mobile first is mandatory. Lesson practice should be comfortable on a phone: short tasks, large tap targets, visible progress, low typing friction.
- Exercises should be generated from structured lesson data: grammar pattern, available words, distractors, accepted answers, hint rules, and progress state.
- Do not hard-code course text directly in React components. Put lesson metadata and exercise data into entities/shared data modules later.

## Overall Method Shape

- The course is an intensive 16-lesson communication-focused program.
- A central idea is automatizing base sentence construction: question, statement, negation across present, past, and future.
- Later lessons expand the base table with pronouns, question words, prepositions, `to be`, articles, adjectives, quantities, phrasal/prepositional patterns, reflexive pronouns, Continuous, numerals, modal verbs, conditionals, `there is/are`, and passive voice.
- Training should emphasize fast transformation rather than passive reading:
  - Russian prompt -> English sentence.
  - Word chips -> correct sentence.
  - Choose correct auxiliary/form.
  - Convert statement/question/negative.
  - Switch tense.
  - Fix common mistake.
  - Fill a missing construction slot.

## Lesson 1: Base Verb Table

Source: https://poliglot16.ru/en/urok1/

Core focus:

- The foundational verb grid for simple sentences.
- Three sentence modes: question, statement, negation.
- Three simple tenses: Present Simple, Past Simple, Future Simple.
- Personal pronouns as subjects.
- Regular and irregular verbs at a minimal starter level.

Constructions to model:

- Present statement: subject + verb, with `-s/-es` for he/she/it.
- Present question: `do/does + subject + verb`.
- Present negation: `subject + do/does not + verb`.
- Past statement: subject + regular `-ed` verb or irregular second form.
- Past question: `did + subject + verb`.
- Past negation: `subject + did not + verb`.
- Future statement: `subject + will + verb`.
- Future question: `will + subject + verb`.
- Future negation: `subject + will not + verb`.

Trainer opportunities:

- Build a 3 x 3 transformation drill: tense by sentence mode.
- Drill auxiliary selection: `do/does/did/will`.
- Drill third-person singular in Present Simple.
- Drill regular vs irregular past only for a small curated verb set.
- Add speed repetition mode because this table is meant to become automatic.

Data notes:

- Start with a compact verb pack: love, live, like, open, close, start, finish, see/saw, come/came, go/went, know/knew, think/thought.
- Store irregular forms explicitly rather than deriving them.

## Lesson 2: Object Pronouns, Question Words, Direction Prepositions

Source: https://poliglot16.ru/en/urok2/

Core focus:

- Expanding Lesson 1 sentences with object pronouns.
- Basic question words.
- Direction/location prepositions.
- Recognizing international word patterns such as Russian `-ция/-сия` to English `-tion/-sion`.

Constructions to model:

- Subject pronoun + verb + object pronoun.
- Question word + base Lesson 1 question pattern.
- Movement/location prepositions: `to`, `from`, `in`.

Trainer opportunities:

- Choose correct object pronoun: me, you, him, her, us, them.
- Add question word before existing auxiliary pattern.
- Translate short prompts like "where/when/why/how" into the correct question scaffold.
- Preposition choice drill for direction vs origin vs inside/location.

Data notes:

- Keep pronouns as a reusable entity: subject, object, possessive adjective, reflexive.
- Question words should be typed data with semantic tags: thing, place, time, reason, person, manner, quantity.

## Lesson 3: To Be

Source: https://poliglot16.ru/en/urok3/

Core focus:

- `to be` as a required English verb where Russian often has no overt verb.
- Forms in present, past, and future.
- Question and negative forms without `do/does/did`.

Constructions to model:

- Present: `I am`, `he/she/it is`, `you/we/they are`.
- Past: `was/were`.
- Future: `will be`.
- Question: move the `to be` form before the subject, or `will + subject + be`.
- Negation: place `not` after `to be`; future uses `will not be`.

Trainer opportunities:

- Detect when Russian prompt lacks a verb and requires `to be`.
- Choose `am/is/are/was/were/will be`.
- Convert `to be` statements into questions and negatives.
- Contrast `to be` patterns with ordinary verb patterns from Lesson 1.

Data notes:

- Represent `to be` as its own construction family, not as an ordinary verb.
- Add semantic roles: identity, location, state/quality, profession.

## Lesson 4: Self-Introduction, Professions, Articles

Source: https://poliglot16.ru/en/urok4/

Core focus:

- Talking about oneself and profession.
- Common etiquette/self-introduction questions.
- Profession word formation with suffixes.
- Prepositions for work/context: `in`, `as`, `at`.
- Articles `a/an/the` at an introductory level.

Constructions to model:

- Asking about occupation/work.
- `work in + place`.
- `work as + profession`.
- `be at + functional place/activity context`.
- `a/an` for one/unspecified instance; `the` for specific/known reference.

Trainer opportunities:

- Guided self-introduction builder.
- Choose article before profession/noun.
- Choose `in/as/at` depending on place, role, or activity context.
- Profession suffix recognition: `-er`, `-or`, `-ist`, `-ian`.

Data notes:

- Separate "phrase templates for self-introduction" from grammar drills.
- Later app can let users store their own self-introduction profile in localStorage.

## Lesson 5: Adjectives, Comparisons, Time Parameters

Source: https://poliglot16.ru/en/urok5/

Core focus:

- Adjectives as compact high-value vocabulary.
- Comparative and superlative forms.
- Time indicators, days of the week, months.
- Prepositions of time.

Constructions to model:

- Short adjective comparative: adjective + `-er` + `than`.
- Short adjective superlative: `the` + adjective + `-est`.
- Long adjective comparative: `more + adjective`.
- Long adjective superlative: `the most + adjective`.
- Time phrases with days/months and common temporal markers.

Trainer opportunities:

- Choose comparative vs superlative.
- Form short/long adjective comparison.
- Pick correct time preposition.
- Translate simple comparison prompts.

Data notes:

- Model adjectives with fields: syllable group, comparative, superlative, irregular flag.
- Time words should be reusable by later tense drills.

## Lesson 6: Quantity Words and Parameter Words

Source: https://poliglot16.ru/en/urok6/

Core focus:

- Countable vs uncountable nouns.
- `many/much`, `few/little`, `a lot of`.
- Quantity questions with `how many/how much`.
- Parameter words that describe dimensions/amounts.

Constructions to model:

- `many` with countable nouns.
- `much` with uncountable nouns.
- `few` with countable nouns for small quantity.
- `little` with uncountable nouns for small quantity.
- `a lot of` as broadly usable in affirmative contexts.
- `how many/how much + noun + ...`.

Trainer opportunities:

- Classify noun as countable/uncountable.
- Choose `many/much/few/little/a lot of`.
- Build quantity questions.
- Fix common Russian-speaker mistakes around uncountable nouns.

Data notes:

- Nouns need `countability` metadata.
- Keep `a lot of` as a phrase token, not three independent words for early exercises.

## Lesson 7: Consolidation and Imperatives

Source: https://poliglot16.ru/en/urok7/

Core focus:

- Consolidation of the base table and earlier material.
- More realistic phrase building across future, present, and past.
- Imperative mood for commands and requests.

Constructions to model:

- Repeated use of the Lesson 1 grid with expanded vocabulary.
- Imperative: base verb at the start of the sentence.
- Negative imperative: `do not/don't + verb`.
- Requests/commands should be treated as a distinct construction family.

Trainer opportunities:

- Mixed review across Lessons 1-6.
- Convert statement to command/request.
- Choose tense from temporal indicator.
- Timed fluency mode for the base table.

Data notes:

- This lesson is a natural checkpoint.
- Add a "mixed practice" generator that samples from previous lesson construction families.

## Lesson 8: Prepositions and Postpositions / Phrasal Verbs

Source: https://poliglot16.ru/en/urok8/

Core focus:

- System of common prepositions.
- Visual/spatial understanding of prepositions.
- Postpositions/particles as a foundation for phrasal verbs.

Constructions to model:

- Core prepositions: to, from, over, on, under, between, in, at, and related spatial/directional items.
- Preposition choice by semantic relation: direction, origin, surface, under, between, inside, location/time point.
- Phrasal verb idea: verb + particle changes or specifies meaning.

Trainer opportunities:

- Picture/semantic prompt -> preposition.
- Choose preposition for location vs movement.
- Match phrasal verb particle to meaning.
- Later: add visual cards for spatial prepositions.

Data notes:

- Store prepositions with semantic categories and simple examples generated by us.
- Do not mix full phrasal verb mastery into early drills; keep it introductory.

## Lesson 9: Reflexive Pronouns and Real Communication

Source: https://poliglot16.ru/en/urok9/

Core focus:

- Reflexive pronouns.
- Encouragement to start communicating with imperfect grammar.
- Understanding short real-life stories using accumulated grammar.

Constructions to model:

- Singular reflexives: myself, yourself, himself, herself, itself.
- Plural reflexives: ourselves, yourselves, themselves.
- Pronoun + self/selves pattern.
- Using reflexives when the subject acts on itself or emphasizes "by oneself".

Trainer opportunities:

- Choose correct reflexive pronoun from subject.
- Convert Russian `сам/себя/-ся` meaning into English reflexive.
- Distinguish object pronoun vs reflexive pronoun.
- Short comprehension practice from paraphrased mini-stories.

Data notes:

- Add reflexive form to the pronoun entity.
- Be careful: not every Russian `-ся` maps mechanically to English reflexive.

## Lesson 10: Communication Practice and Storytelling

Source: https://poliglot16.ru/en/urok10/

Core focus:

- Free communication practice.
- Telling real-life stories.
- Reusing base structures until they stop causing difficulty.
- Hiding translation first and revealing it after user attempt is a useful learning pattern.

Constructions to model:

- Open-ended past event questions.
- Storytelling with past actions, place/time details, and follow-up questions.
- Review of prior vocabulary and grammar in longer utterances.

Trainer opportunities:

- Prompt user to assemble answers about recent events.
- Reveal translation/hint only after attempt.
- Sentence ordering for short story fragments.
- Practice "what happened recently?" style prompts.

Data notes:

- Keep lesson 10 as review + communication, not a new grammar-heavy lesson.
- Add future "personal story" mode that lets user save custom phrases locally.

## Lesson 11: Continuous and Third Verb Form

Source: https://poliglot16.ru/en/urok11/

Core focus:

- Continuous/Progressive tenses.
- Difference between Simple as fact/habit and Continuous as process.
- Introduction of the third verb form because it will matter for Perfect and Passive.

Constructions to model:

- Continuous: subject + `to be` in required tense + verb + `-ing`.
- Present Continuous: `am/is/are + V-ing`.
- Past Continuous: `was/were + V-ing`.
- Future Continuous: `will be + V-ing`.
- Simple vs Continuous contrast.
- Third verb form as a separate verb field.

Trainer opportunities:

- Choose Simple or Continuous based on "fact/habit" vs "in progress".
- Build Continuous in present/past/future.
- Add `-ing` form selection.
- Identify third form for irregular verbs.

Data notes:

- Verb entity should include: base, past, third form, ing form, regularity.
- Keep Perfect as follow-up context; do not overload this lesson if app scope starts small.

## Lesson 12: Numerals and Dates

Source: https://poliglot16.ru/en/urok12/

Core focus:

- Cardinal and ordinal numerals.
- Number formation patterns.
- Dates and larger numbers.

Constructions to model:

- Cardinal numerals for quantity.
- Ordinal numerals for order/date.
- Suffix patterns: `-teen`, `-ty`, `-th`.
- Compound numbers with hyphenated tens/ones.
- Dates using ordinal logic.

Trainer opportunities:

- Number -> English word.
- English numeral phrase -> number.
- Cardinal vs ordinal choice.
- Date reading/writing practice.

Data notes:

- Numerals are best generated algorithmically but verified with exceptions.
- Store irregular ordinals: first, second, third, fifth, eighth, ninth, twelfth.

## Lesson 13: Modal Verbs and Let

Source: https://poliglot16.ru/en/urok13/

Core focus:

- Modal verbs: can/could, should/shouldn't, must/mustn't.
- `let` and `let's`.
- Common contractions.
- Modal verbs express ability, possibility, advice, obligation, prohibition, or permission rather than ordinary lexical action.

Constructions to model:

- Modal + base verb without `to`.
- Modal questions by placing modal before subject.
- Modal negation with `not`.
- `let + object + verb`.
- `let's + verb` for suggestions.
- `let's not + verb` for negative suggestion.

Trainer opportunities:

- Choose modal based on intent: ability, advice, obligation, prohibition.
- Build modal question/statement/negative.
- Distinguish `lets` from `let's`.
- Practice `let me/him/her/them/us + verb`.

Data notes:

- Modal verbs should be separate construction family from ordinary verbs.
- Store semantic labels for task generation: ability, permission, advice, necessity.

## Lesson 14: First Conditional and Subject Questions

Source: https://poliglot16.ru/en/urok14/

Core focus:

- First conditional and time clauses.
- `if/when + Present Simple`, main clause in Future Simple.
- Subject questions with `who/what`.
- Common mistakes, especially using `will` in the condition clause.

Constructions to model:

- If/when clause: `if/when + Present Simple`.
- Result clause: `will + verb`.
- Clause order can vary.
- Subject question: replace subject with `who/what`; no `do/does/did` auxiliary for subject position.

Trainer opportunities:

- Remove incorrect `will` after `if/when`.
- Build first conditional from two clause cards.
- Choose subject question vs object/general question.
- Fix common mistake mode.

Data notes:

- Need task metadata for clause role: condition/time clause vs result clause.
- Subject question generation requires knowing which argument is the subject.

## Lesson 15: There Is / There Are

Source: https://poliglot16.ru/en/urok15/

Core focus:

- Existential construction `there is/there are`.
- Present, past, and future forms.
- Statement, negative, and question patterns.
- Russian translation often starts from the location rather than word-for-word order.

Constructions to model:

- Statement: `there + to be + object + place/time`.
- Present singular/plural: `there is/there are`.
- Past singular/plural: `there was/there were`.
- Future: `there will be`.
- Negation: `there is/are/was/were not`, `there will not be`.
- Question: move `to be` or `will` before `there`.

Trainer opportunities:

- Choose `is/are/was/were/will be` based on number and tense.
- Reorder Russian location-first prompt into English `there` structure.
- Build question/negative forms.
- Contrast `it is` vs `there is`.

Data notes:

- Noun number metadata is required.
- Location phrases from preposition lessons should be reused.

## Lesson 16: Passive Voice

Source: https://poliglot16.ru/en/urok16/

Core focus:

- Active vs passive voice.
- Passive as focus on result/object rather than performer.
- `to be + past participle`.
- Use of `by`/`with` when performer or instrument is named.
- Passive in several tense groups.

Constructions to model:

- Passive: subject/object + `to be` in required tense + third verb form or regular `-ed`.
- Active: subject performs action.
- Performer phrase: `by + agent`.
- Instrument phrase: `with + instrument`.
- Questions/negations follow the `to be` auxiliary logic.

Trainer opportunities:

- Convert active to passive.
- Choose correct `to be` form for passive.
- Choose past participle/third form.
- Decide when `by` or `with` is needed.
- Identify whether Russian prompt focuses on actor or result.

Data notes:

- Passive depends on robust verb third-form data from Lesson 11.
- Some verbs/phrases are not natural in passive; later generators need allowlists.

## Cross-Lesson Data Model Ideas

Potential entities:

- `Lesson`: id, route, title, summary, source links, construction ids, vocabulary pack ids.
- `Construction`: id, name, lesson introduced, formula, slots, sentence modes, tense compatibility, common mistakes.
- `VocabularyItem`: id, base, translation, part of speech, lesson introduced, tags, forms.
- `Verb`: base, translation, regularity, past, third form, ing form.
- `Pronoun`: subject, object, possessive adjective, reflexive, person, number.
- `ExerciseTemplate`: construction id, prompt language, answer strategy, distractor strategy, validation rules.
- `UserProgress`: lesson id, construction id, attempts, correct attempts, last practiced, mastered flag.

Potential trainer modes:

- Word-chip sentence assembly.
- Auxiliary/form choice.
- Transform sentence mode: statement/question/negative.
- Transform tense.
- Translate prompt.
- Error correction.
- Mixed review by unlocked lessons.
- Personal phrase bank saved in localStorage.

## Source Links

- User-provided Lesson 1 video: https://www.youtube.com/watch?v=Yxdcr0Sj824
- Program overview: https://ru.wikipedia.org/wiki/Полиглот_(телепередача)
- Poliglot16 lesson index: https://poliglot16.ru/en/
- Poliglot16 notes index: https://poliglot16.ru/en-konspekty/
- Lesson pages:
  - https://poliglot16.ru/en/urok1/
  - https://poliglot16.ru/en/urok2/
  - https://poliglot16.ru/en/urok3/
  - https://poliglot16.ru/en/urok4/
  - https://poliglot16.ru/en/urok5/
  - https://poliglot16.ru/en/urok6/
  - https://poliglot16.ru/en/urok7/
  - https://poliglot16.ru/en/urok8/
  - https://poliglot16.ru/en/urok9/
  - https://poliglot16.ru/en/urok10/
  - https://poliglot16.ru/en/urok11/
  - https://poliglot16.ru/en/urok12/
  - https://poliglot16.ru/en/urok13/
  - https://poliglot16.ru/en/urok14/
  - https://poliglot16.ru/en/urok15/
  - https://poliglot16.ru/en/urok16/
- Existing app/trainer reference: https://play.google.com/store/apps/details?hl=ru&id=com.kostosha.poliglot16.full
