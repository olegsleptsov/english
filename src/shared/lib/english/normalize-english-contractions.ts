type NegativeAuxiliaryRule = {
  auxiliary: string;
  expansion: string;
  contractions: string[];
  extraFullForms?: string[];
};

const NEGATIVE_AUXILIARY_RULES: NegativeAuxiliaryRule[] = [
  { auxiliary: 'do', expansion: 'do not', contractions: ["don't"] },
  { auxiliary: 'does', expansion: 'does not', contractions: ["doesn't"] },
  { auxiliary: 'did', expansion: 'did not', contractions: ["didn't"] },
  { auxiliary: 'is', expansion: 'is not', contractions: ["isn't"] },
  { auxiliary: 'are', expansion: 'are not', contractions: ["aren't"] },
  { auxiliary: 'was', expansion: 'was not', contractions: ["wasn't"] },
  { auxiliary: 'were', expansion: 'were not', contractions: ["weren't"] },
  { auxiliary: 'have', expansion: 'have not', contractions: ["haven't"] },
  { auxiliary: 'has', expansion: 'has not', contractions: ["hasn't"] },
  { auxiliary: 'had', expansion: 'had not', contractions: ["hadn't"] },
  { auxiliary: 'will', expansion: 'will not', contractions: ["won't"] },
  { auxiliary: 'would', expansion: 'would not', contractions: ["wouldn't"] },
  { auxiliary: 'should', expansion: 'should not', contractions: ["shouldn't"] },
  { auxiliary: 'could', expansion: 'could not', contractions: ["couldn't"] },
  {
    auxiliary: 'can',
    expansion: 'can not',
    contractions: ["can't"],
    extraFullForms: ['cannot'],
  },
  { auxiliary: 'must', expansion: 'must not', contractions: ["mustn't"] },
  { auxiliary: 'shall', expansion: 'shall not', contractions: ["shan't"] },
  { auxiliary: 'might', expansion: 'might not', contractions: ["mightn't"] },
  { auxiliary: 'need', expansion: 'need not', contractions: ["needn't"] },
];

export function normalizeEnglishNegativeContractions(value: string) {
  return NEGATIVE_AUXILIARY_RULES.reduce(
    (normalizedValue, rule) => normalizeNegativeAuxiliary(normalizedValue, rule),
    value.replace(/’/gu, "'"),
  );
}

function normalizeNegativeAuxiliary(
  value: string,
  {
    auxiliary,
    contractions,
    expansion,
    extraFullForms = [],
  }: NegativeAuxiliaryRule,
) {
  const aliases = new Set([
    `${auxiliary} not`,
    `${auxiliary}n't`,
    `${auxiliary}nt`,
    `${auxiliary} n't`,
    `${auxiliary} nt`,
    ...extraFullForms,
    ...contractions.flatMap((contraction) => [
      contraction,
      contraction.replace("'", ''),
      contraction.replace("'", ' '),
    ]),
  ]);

  return [...aliases].reduce(
    (normalizedValue, alias) =>
      normalizedValue.replace(createAliasRegexp(alias), expansion),
    value,
  );
}

function createAliasRegexp(alias: string) {
  const escapedAlias = alias
    .trim()
    .split(/\s+/u)
    .map(escapeRegExp)
    .join('\\s+');

  return new RegExp(`\\b${escapedAlias}\\b`, 'giu');
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
}
