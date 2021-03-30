import fs from 'fs';
import { copy } from 'fs-extra';
import {
  convertWithBounds,
  convertWithFlags,
  convertWithFlagsAndFeatures,
} from './converters';
import { convertDbToJsonArray, convertJsonArrayToDb } from './utils';

export const makeLibDir = () => {
  fs.mkdirSync('lib');
  fs.mkdirSync('lib/images');
  fs.mkdirSync('lib/packs');
};

export const copyModuleJson = () =>
  fs.copyFileSync('assets/module.json', 'lib/module.json');

export const copyImages = async () => await copy('assets/images', 'lib/images');

const copyAndConvert = <T>(
  source: string,
  destination: string,
  convertFunction: (t: T[]) => T[],
) => {
  const sourceDb = fs.readFileSync(source, 'utf-8');

  const dbBlob = convertDbToJsonArray(sourceDb);

  const dbJson = dbBlob.map((blob) => blob && JSON.parse(blob)).filter(Boolean);

  const convertedJson = convertFunction(dbJson);

  const convertedDb = convertJsonArrayToDb(convertedJson);

  fs.writeFileSync(destination, convertedDb);
};

export const copyPacks = async () => {
  copyAndConvert(
    'assets/packs/class-features.db',
    'lib/packs/class-features.db',
    convertWithFlags,
  );
  copyAndConvert(
    'assets/packs/classes.db',
    'lib/packs/classes.db',
    convertWithFlagsAndFeatures,
  );
  copyAndConvert(
    'assets/packs/feats.db',
    'lib/packs/feats.db',
    convertWithBounds,
  );
  copyAndConvert(
    'assets/packs/items.db',
    'lib/packs/items.db',
    convertWithBounds,
  );
  copyAndConvert(
    'assets/packs/races.db',
    'lib/packs/races.db',
    convertWithBounds,
  );
  copyAndConvert(
    'assets/packs/racial-traits.db',
    'lib/packs/racial-traits.db',
    convertWithBounds,
  );
  copyAndConvert(
    'assets/packs/spells.db',
    'lib/packs/spells.db',
    convertWithBounds,
  );
};
