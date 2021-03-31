import { Bounds, Range } from '../types';
import { convertSquareFeet, convertFeet } from './utils';

export const convertWeight = (weigth?: number): number | undefined =>
  weigth ? Math.floor(weigth / 2.2) : weigth;

const convertBounds = (bounds: Bounds): Bounds => {
  const { value, type, ...rest } = bounds;
  if (value === null) {
    return { value, type, ...rest };
  }
  if (type === 'square feet') {
    const [[convertedValue]] = convertSquareFeet(value);

    return {
      ...rest,
      value: convertedValue,
      units: 'm',
      type: 'square meters',
    };
  }

  const [[convertedValue]] = convertFeet(value);

  return { ...rest, value: convertedValue, units: 'm', type };
};

export const convertTarget = (target?: Bounds): Bounds | undefined => {
  if (!target) {
    return undefined;
  }

  return convertBounds(target);
};

export const convertRange = (range?: Range): Range | undefined => {
  if (!range) {
    return undefined;
  }
  const { long, ...rest } = range;
  const convertedLong = long ? convertFeet(long)[0][0] : null;

  return {
    ...convertBounds(rest),
    long: convertedLong,
    units: long || range.value !== null ? 'm' : range.units,
  };
};
