# D&D Source Books

This is a repo for scripts to use together with D&D Beyond Foundry modules. It might need some
configuration, as there is no error handling as of now. Feel free to fork or contribute.

## Table of contents

- [Table of Contents](#table-of-contents)
- [Getting started](#getting-started)
- [Scripts](#scripts)

## Getting Started

Clone repository

```bash
git clone https://github.com/heartistizio/dnd-source-books
```

Go inside the directory

```bash
cd dnd-source-books
```

Check node&npm version

```bash
nvm use
```

Install dependencies

```bash
npm install
```

## Scripts

### Imperial to Metric conversion

This script is meant for conversion of imperial units to metric in D&D Beyond compendiums imported
using [ddb-importer](https://github.com/MrPrimate/ddb-importer). It uses approximation and nicer
numbers rather than accuracy. Not all edge cases are covered.

#### Conversion rules

##### Feet

- Anything under 5 feet is represented as `1 feet = 30 centimeters`.
- Over 5 feet lengths are represented as `5 feet = 1.5 meter`.
- Square feet are represented as `10 square feet = 1 square meter`
- There is support for `radius` and `high` syntax.

##### Miles

- Miles are represented as `1 mile = 1.5 kilometers`.

##### Inches

- Inches are represented as `1 inch = 2.5 centimeters`.

##### Gallons

- Gallons are represented as `1 gallon = 4 liters`.

#### How to run

Copy `Compendium` module into `assets` directory and run:

```bash
npm run convert

yarn convert
```

Copies `module.json`, `images` and `packs` from `assets` directory. These `packs` will be copied as
long as they fulfil following interfaces.

##### class-features

```ts
export interface ItemWithFlags {
  data: {
    description: Description;
  };
  flags: Flags;
}
```

##### classes

```ts
export interface ItemWithFlagsAndFeatures {
  data: {
    description: Description;
  };
  flags: FlagsWithFeatures;
}
```

##### feats, items, races, racial-traits, spells

```ts
export interface ItemWithBounds {
  data: {
    description: Description;
    target?: Bounds;
    range?: Range;
  };
}
```
