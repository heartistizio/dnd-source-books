import { Flags, FlagsWithFeatures } from 'types';
import { convertComplexStringUnits } from './utils';

export const convertFlags = ({ ddbimporter, ...rest }: Flags) => ({
  ...rest,
  ddbimporter: {
    data: {
      ...ddbimporter.data,
      description: convertComplexStringUnits(ddbimporter.data.description),
    },
  },
});

export const convertFlagsWithClassFeatures = ({
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
