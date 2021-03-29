import fs from 'fs';
import { copy } from 'fs-extra';

const makeLibDir = async () => await fs.mkdirSync('lib');

const copyModuleJson = () =>
  fs.copyFileSync('assets/module.json', 'lib/module.json');

const copyImages = async () => await copy('assets/images', 'lib/images');

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

const convertDescription = ({
  value,
  chat,
  unidentified,
}: {
  value: string;
  chat: string;
  unidentified: string;
}) => ({
  value: convertComplexStringUnits(value),
  chat: convertComplexStringUnits(chat),
  unidentified: convertComplexStringUnits(unidentified),
});

const convertDimension = ({
  value,
  type,
  ...rest
}: {
  value: number;
  type: string | null;
}) => {
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

  return { ...rest, value: convertedValue, units: 'm' };
};

const copySpells = () => {
  const spellsString = fs.readFileSync('assets/packs/spells.db', 'utf-8');

  const spellsStringInArray = `${spellsString
    .replace(/{"name":/g, ',{"name":')
    .replace(',', '[')}]`;

  const spells = JSON.parse(spellsStringInArray);

  const metricSpells = spells.map((spell: any) => ({
    ...spell,
    data: {
      ...spell.data,
      description: convertDescription(spell.data.description),
      target: convertDimension(spell.data.target),
      range: convertDimension(spell.data.range),
    },
  }));

  const stringifiedMetricSpells = JSON.stringify(metricSpells);

  fs.writeFileSync(
    'assets/packs/spells.db',
    stringifiedMetricSpells
      .substring(1, stringifiedMetricSpells.length - 1)
      .replace(/,{"name":/g, '{"name":'),
  );
};

const copyPacks = async () => {
  fs.copyFileSync('assets/module.json', 'lib/packs/module.json');
  fs.copyFileSync(
    'assets/packs/class-features.db',
    'lib/packs/class-features.db',
  );
  fs.copyFileSync('assets/packs/classes.db', 'lib/packs/classes.db');
  fs.copyFileSync('assets/packs/feats.db', 'lib/packs/feats.db');
  fs.copyFileSync('assets/packs/items.db', 'lib/packs/items.db');
  fs.copyFileSync('assets/packs/races.db', 'lib/packs/races.db');
  fs.copyFileSync(
    'assets/packs/racial-traits.db',
    'lib/packs/racial-traits.db',
  );
  copySpells();
};

makeLibDir();
copyModuleJson();
copyImages();
copySpells();
