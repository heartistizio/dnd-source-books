import {
  Bounds,
  Description,
  Flags,
  FlagsWithFeatures,
  Range,
  ItemWithBounds,
  ItemWithFlags,
  ItemWithFlagsAndFeatures,
} from './types';

const convertMiles = (value: number): [number, string] => [
  value * 1.5,
  'kilometers',
];

const convertFeet = (
  value: number,
  radial = false,
  radialSuffix = '',
): [number, string] => {
  if (value > 5) {
    const convertedValue = Math.ceil(value / 5) * 1.5;
    const unit = radial ? `-meter${radialSuffix}` : ' meters';
    return [convertedValue, unit];
  }

  if (value === 5) {
    const unit = radial ? `-meter${radialSuffix}` : ' meter';
    return [1.5, unit];
  }

  const unit = radial ? `centimeter${radialSuffix}` : ' centimeters';

  return [value * 30, unit];
};

const convertSquareFeet = (value: number): [number, string] => [
  value / 10,
  'square meters',
];

const convertInches = (value: number): [number, string] => [
  convertToNumeric(value) * 2.5,
  'centimeters',
];
const convertGallons = (value: number): [number, string] => [
  convertToNumeric(value) * 4,
  'liters',
];

const imperialToMetric = {
  miles: convertMiles,
  'square feet': convertSquareFeet,
  feet: convertFeet,
  'foot-radius': (value: number) => convertFeet(value, true, '-radius'),
  'foot-high': (value: number) => convertFeet(value, true, '-high'),
  foot: (value: number) => convertFeet(value, true),
  inch: convertInches,
  gallons: convertGallons,
};

const convertToNumeric = (value: number | string) =>
  typeof value === 'string' ? parseInt(value) : value;

const convertComplexStringUnits = (
  value: string,
  template = imperialToMetric,
) =>
  Object.entries(template).reduce(
    (acc, [unit, callback]) =>
      acc.replace(RegExp(`[0-9]+[ -]+${unit}`, `g`), (value: number | string) =>
        callback(convertToNumeric(value)).join(''),
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
