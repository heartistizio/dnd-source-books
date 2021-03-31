import {
  ItemWithBounds,
  ItemWithFlags,
  ItemWithFlagsAndFeatures,
} from '../types';
import { convertTarget, convertRange } from './bounds';
import { convertDescription } from './description';
import { convertFlags, convertFlagsWithClassFeatures } from './flags';

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
