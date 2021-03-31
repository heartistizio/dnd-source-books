import { Bounds, Range } from '../types';
import { convertRange, convertTarget } from './bounds';

describe('convertTarget', () => {
  const defaultTarget: Bounds = {
    value: null,
    type: null,
    units: null,
  };
  it('returns undefined for no target', () => {
    expect(convertTarget(undefined)).toBeUndefined();
  });

  it('returns target if target.value is null', () => {
    const target = { ...defaultTarget, value: null };
    expect(convertTarget(target)).toEqual(target);
  });

  it('converts square feet', () => {
    const target = {
      ...defaultTarget,
      value: 4000,
      type: 'square feet',
      units: 'ft',
    };
    expect(convertTarget(target)).toEqual({
      ...defaultTarget,
      value: 400,
      type: 'square meters',
      units: 'm',
    });
  });

  it('converts feet', () => {
    const target = {
      ...defaultTarget,
      value: 50,
      units: 'ft',
    };
    expect(convertTarget(target)).toEqual({
      ...defaultTarget,
      value: 15,
      units: 'm',
    });
  });
});
describe('convertRange', () => {
  const defaultRange: Range = {
    value: null,
    type: null,
    units: null,
    long: null,
  };
  it('returns undefined for no range', () => {
    expect(convertRange(undefined)).toBeUndefined();
  });

  it('returns range if range.value is null', () => {
    const range = { ...defaultRange, value: null };

    expect(convertRange(range)).toEqual(range);
  });

  it('returns non converted long if range.long is null', () => {
    const range = { ...defaultRange, value: null, long: null };

    expect(convertRange(range)).toEqual(range);
  });

  it('converts square feet', () => {
    const range = {
      ...defaultRange,
      value: 4000,
      type: 'square feet',
      units: 'ft',
    };
    expect(convertRange(range)).toEqual({
      ...defaultRange,
      value: 400,
      type: 'square meters',
      units: 'm',
    });
  });

  it('converts value to feet even if long is null', () => {
    const range = {
      ...defaultRange,
      value: 50,
      units: 'ft',
    };
    expect(convertRange(range)).toEqual({
      ...defaultRange,
      value: 15,
      units: 'm',
    });
  });

  it('converts long to feet even if value is null', () => {
    const range = {
      ...defaultRange,
      long: 100,
      units: 'ft',
    };
    expect(convertRange(range)).toEqual({
      ...defaultRange,
      long: 30,
      units: 'm',
    });
  });

  it('converts to feet', () => {
    const range = {
      ...defaultRange,
      value: 50,
      long: 100,
      units: 'ft',
    };
    expect(convertRange(range)).toEqual({
      ...defaultRange,
      value: 15,
      long: 30,
      units: 'm',
    });
  });
});
