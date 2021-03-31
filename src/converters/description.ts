import { Description } from '../types';
import { convertComplexStringUnits } from './utils';

export const convertDescription = ({
  value,
  chat,
  unidentified,
}: Description) => ({
  value: value ? convertComplexStringUnits(value) : null,
  chat: chat ? convertComplexStringUnits(chat) : null,
  unidentified: unidentified ? convertComplexStringUnits(unidentified) : null,
});
