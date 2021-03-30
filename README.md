# D&D Source Books

This is a repo for scripts to use together with D&D Beyond Foundry modules. It might need some
configuration, as there is no error handling as of now. Feel free to fork or contribute.

## Scripts

### Imperial to Metric conversion

This script is meant for conversion of imperial units to metric in D&D Beyond compendiums imported
using [ddb-importer](https://github.com/MrPrimate/ddb-importer). It uses approximation and nicer
numbers rather than accuracy. Not all edge cases are covered.

Copy `Compendium` module into `assets` directory and run:

```bash
npm run convert

yarn convert
```

Copies `module.json`, `images` and `packs` from `assets` directory. These `packs` will be copied as
long as they fulfil following interfaces.

#### class-features

```ts
export interface ItemWithFlags {
  data: {
    description: Description;
  };
  flags: Flags;
}
```

#### classes

```ts
export interface ItemWithFlagsAndFeatures {
  data: {
    description: Description;
  };
  flags: FlagsWithFeatures;
}
```

#### feats, items, races, racial-traits, spells

```ts
export interface ItemWithBounds {
  data: {
    description: Description;
    target?: Bounds;
    range?: Range;
  };
}
```
