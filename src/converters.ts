import {
  Bounds,
  Description,
  Flags,
  FlagsWithFeatures,
  Range,
  ItemWithBounds,
  ItemWithFlags,
  ItemWithFlagsAndFeatures,
  Units,
  Converter,
} from './types';

const convertMiles = (value: string): [number, string] => [
  convertToNumeric(value) * 1.5,
  'kilometers',
];

const specialValuesMap: Record<string, number> = {
  '5': 1.5,
  '6': 1.8,
  '7': 2.1,
};

const convertSpecialFeetValuesToMeters = (
  value: number,
  radial: boolean,
  radialSuffix: string,
  template = specialValuesMap,
): [number, string] => [
  specialValuesMap[String(value)],
  radial ? `-meter${radialSuffix}` : ' meter',
];

const convertFeetToMeters = (
  value: number,
  radial: boolean,
  radialSuffix: string,
): [number, string] => {
  const specialValue = convertSpecialFeetValuesToMeters(
    value,
    radial,
    radialSuffix,
  );

  if (specialValue) {
    return specialValue;
  }

  const convertedValue = Math.ceil(value / 5) * 1.5;
  const unit = radial ? `-meter${radialSuffix}` : ' meters';
  return [convertedValue, unit];
};

const convertFeetToCentimeters = (
  value: number,
  radial: boolean,
  radialSuffix: string,
): [number, string] => [
  value * 30,
  radial ? `centimeter${radialSuffix}` : ' centimeters',
];

const convertFeet = (value: number, radial = false, radialSuffix = '') =>
  value > 5
    ? convertFeetToMeters(value, radial, radialSuffix)
    : convertFeetToCentimeters(value, radial, radialSuffix);

const convertSquareFeet = (value: string | number): [number, string] => [
  convertToNumeric(value) / 10,
  'square meters',
];

const convertInches = (value: string): [number, string] => [
  convertToNumeric(value) * 2.5,
  'centimeters',
];
const convertGallons = (value: string): [number, string] => [
  convertToNumeric(value) * 4,
  'liters',
];

const convertTupleToNumeric = (value: string) =>
  value
    .split(' ')
    .map((value) => parseInt(value))
    .filter((element) => !isNaN(element));

const convertTuplePounds = (
  value: string,
): [number, string] | [string, number, string, number, string] => {
  const [first, second] = convertTupleToNumeric(value);

  return second
    ? [
        'between ',
        Math.floor(convertToNumeric(first) / 2.2),
        ' and ',
        Math.floor(convertToNumeric(second) / 2.2),
        ' kilogram',
      ]
    : [Math.floor(convertToNumeric(first) / 2.2), ' kilogram'];
};

const imperialToMetric: Record<Units, Converter> = {
  miles: convertMiles,
  'square feet': convertSquareFeet,
  feet: (value: string) => convertFeet(convertToNumeric(value)),
  'foot-radius': (value: string) =>
    convertFeet(convertToNumeric(value), true, '-radius'),
  'foot-high': (value: string) =>
    convertFeet(convertToNumeric(value), true, '-high'),
  foot: (value: string) => convertFeet(convertToNumeric(value), true),
  inch: convertInches,
  gallons: convertGallons,
  pound: convertTuplePounds,
};

const unitToRegExp: Record<Units, RegExp> = {
  miles: /[0-9]+[ -]+miles/g,
  'square feet': /[0-9]+[ -]+square feet/g,
  feet: /[0-9]+[ -]+feet/g,
  'foot-radius': /[0-9]+[ -]+foot-radius/g,
  'foot-high': /[0-9]+[ -]+foot-high/g,
  foot: /[0-9]+[ -]+foot/g,
  inch: /[0-9]+[ -]+inch/g,
  gallons: /[0-9]+[ -]+gallons/g,
  pound: /(between [0-9]+ and )?[0-9]+[ -]pound/g,
};

const convertToNumeric = (value: number | string) =>
  typeof value === 'string' ? parseInt(value) : value;

const convertComplexStringUnits = (
  value: string,
  template = imperialToMetric,
  regexTemplate = unitToRegExp,
) =>
  Object.entries(template).reduce(
    (acc, [unit, callback]) =>
      acc.replace(regexTemplate[unit as Units], (value) =>
        callback(value).join(''),
      ),
    value,
  );

const convertDescription = ({ value, chat, unidentified }: Description) => ({
  value: value ? convertComplexStringUnits(value) : null,
  chat: chat ? convertComplexStringUnits(chat) : null,
  unidentified: unidentified ? convertComplexStringUnits(unidentified) : null,
});

const convertBounds = (bounds: Bounds): Bounds => {
  const { value, type, ...rest } = bounds;
  if (value === null) {
    return { value, type, ...rest };
  }
  if (type === 'square feet') {
    const [convertedValue] = convertSquareFeet(value);

    return {
      ...rest,
      value: convertedValue,
      units: 'm',
      type: 'square meters',
    };
  }

  const [convertedValue] = convertFeet(value);

  return { ...rest, value: convertedValue, units: 'm', type };
};

const convertTarget = (target?: Bounds): Bounds | undefined => {
  if (!target) {
    return undefined;
  }

  return convertBounds(target);
};

const convertRange = (range?: Range): Range | undefined => {
  if (!range) {
    return undefined;
  }
  const { long, ...rest } = range;
  const convertedLong = long ? convertFeet(long)[0] : null;

  return { ...convertBounds(rest), long: convertedLong };
};

const convertFlags = ({ ddbimporter, ...rest }: Flags) => ({
  ...rest,
  ddbimporter: {
    data: {
      ...ddbimporter.data,
      description: convertComplexStringUnits(ddbimporter.data.description),
    },
  },
});

const convertFlagsWithClassFeatures = ({
  ddbimporter,
  ...rest
}: FlagsWithFeatures) => ({
  ...rest,
  ddbimporter: {
    data: {
      ...ddbimporter.data,
      description: convertComplexStringUnits(ddbimporter.data.description),
      classFeatures: ddbimporter.data.classFeatures.map((feature) =>
        convertComplexStringUnits(feature.description),
      ),
    },
  },
});

export const convertWithFlags = (items: ItemWithFlags[]): ItemWithFlags[] =>
  items.map((item) => ({
    ...item,
    data: {
      ...item.data,
      description: convertDescription(item.data.description),
      flags: convertFlags(item.flags),
    },
  }));

export const convertWithFlagsAndFeatures = (
  items: ItemWithFlagsAndFeatures[],
): ItemWithFlagsAndFeatures[] =>
  items.map((item) => ({
    ...item,
    data: {
      ...item.data,
      description: convertDescription(item.data.description),
      flags: convertFlagsWithClassFeatures(item.flags),
    },
  }));

export const convertWithBounds = (items: ItemWithBounds[]): ItemWithBounds[] =>
  items.map((item) => ({
    ...item,
    data: {
      ...item.data,
      description: convertDescription(item.data.description),
      target: convertTarget(item.data.target),
      range: convertRange(item.data.range),
    },
  }));
