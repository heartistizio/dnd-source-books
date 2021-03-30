export interface Description {
  value: string | null;
  chat: string | null;
  unidentified: string | null;
}

export interface Bounds {
  value: number | null;
  type: string | null;
  units: string | null;
}

export interface Range extends Bounds {
  long: number | null;
}

interface ClassFeatureDescription {
  description: string;
}

export interface Flags {
  ddbimporter: {
    data: {
      description: string;
    };
  };
}

export interface FlagsWithFeatures {
  ddbimporter: {
    data: {
      description: string;
      classFeatures: ClassFeatureDescription[];
    };
  };
}

export interface ItemWithFlags {
  data: {
    description: Description;
  };
  flags: Flags;
}

export interface ItemWithFlagsAndFeatures {
  data: {
    description: Description;
  };
  flags: FlagsWithFeatures;
}

export interface ItemWithBounds {
  data: {
    description: Description;
    target?: Bounds;
    range?: Range;
  };
}
