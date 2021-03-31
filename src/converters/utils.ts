import { Units, Converter } from '../types';

const convertToNumeric = (value: number | string) =>
  typeof value === 'string' ? parseInt(value.replace(/ /g, '')) : value;

const convertMiles = (value: string): [[number, string], string] => [
  [convertToNumeric(value) * 1.5, 'kilometers'],
  ' ',
];

const specialValuesMap: Record<string, number> = {
  '5': 1.5,
  '6': 1.8,
  '7': 2.1,
};

const convertSpecialFeetValuesToMeters = (
  value: number,
  radial: boolean,
  numberSeperator: string,
  template = specialValuesMap,
): [[number, string, string], string] => [
  [template[String(value)], numberSeperator, 'meter'],
  radial ? '' : ' ',
];

const convertFeetToMeters = (
  value: number,
  radial: boolean,
  numberSeperator: string,
): [[number, string, string], string] => {
  const specialValue = convertSpecialFeetValuesToMeters(
    value,
    radial,
    numberSeperator,
  );

  if (specialValue[0][0]) {
    return specialValue;
  }

  const convertedValue = Math.ceil(value / 5) * 1.5;

  return [
    [convertedValue, numberSeperator, radial ? 'meter' : 'meters'],
    radial ? '' : ' ',
  ];
};

const convertFeetToCentimeters = (
  value: number,
  radial: boolean,
  numberSeperator: string,
): [[number, string, string], string] => [
  [value * 30, numberSeperator, radial ? 'centimeter' : 'centimeters'],
  radial ? '' : ' ',
];

export const convertFeet = (
  value: number,
  radial = false,
  numberSeperator = '',
) =>
  value >= 5
    ? convertFeetToMeters(value, radial, numberSeperator)
    : convertFeetToCentimeters(value, radial, numberSeperator);

export const convertSquareFeet = (
  value: string | number,
): [[number, string], string] => [
  [convertToNumeric(value) / 10, 'square meters'],
  ' ',
];

const convertInches = (value: string): [[number, string], string] => [
  [convertToNumeric(value) * 2.5, 'centimeters'],
  ' ',
];
const convertGallons = (value: string): [[number, string], string] => [
  [convertToNumeric(value) * 4, 'liters'],
  ' ',
];

const convertTupleToNumeric = (value: string) =>
  value
    .split(' ')
    .map((value) => parseInt(value))
    .filter((element) => !isNaN(element));

const convertTuplePounds = (value: string): [(number | string)[], string] => {
  const [first, second] = convertTupleToNumeric(value);

  return [
    second
      ? [
          'between',
          Math.floor(convertToNumeric(first) / 2.2),
          'and',
          Math.floor(convertToNumeric(second) / 2.2),
          'kilogram',
        ]
      : [Math.floor(convertToNumeric(first) / 2.2), 'kilogram'],
    ' ',
  ];
};

const imperialToMetric: Record<Units, any> = {
  miles: convertMiles,
  'square feet': convertSquareFeet,
  feet: (value: string) => convertFeet(convertToNumeric(value)),
  '-foot': (value: string) => convertFeet(convertToNumeric(value), true, '-'),
  foot: (value: string) => convertFeet(convertToNumeric(value), true, ' '),
  inches: convertInches,
  inch: convertInches,
  gallons: convertGallons,
  pound: convertTuplePounds,
};

const unitToRegExp: Record<Units, RegExp> = {
  miles: /[0-9]+[ -]+miles/g,
  'square feet': /[0-9]+( [0-9]+)[ -]+square feet/g,
  feet: /[0-9]+[ -]+feet/g,
  '-foot': /[0-9]+-foot/g,
  foot: /[0-9]+ foot/g,
  inches: /[0-9]+[ -]+inches/g,
  inch: /[0-9]+[ -]+inch/g,
  gallons: /[0-9]+[ -]+gallons/g,
  pound: /(between [0-9]+ and )?[0-9]+[ -]pound/g,
};

const handleConversionCalback = (value: string, callback: Converter) => {
  const [result, separator = ''] = callback(value);

  return result.filter(Boolean).join(separator);
};

export const convertComplexStringUnits = (
  value: string,
  template = imperialToMetric,
  regexTemplate = unitToRegExp,
) =>
  Object.entries(template).reduce(
    (acc, [unit, callback]) =>
      acc.replace(regexTemplate[unit as Units], (value) =>
        handleConversionCalback(value, callback),
      ),
    value,
  );
