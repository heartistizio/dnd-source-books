import { convertComplexStringUnits } from './utils';

describe('convertComplexStringUnits', () => {
  it('converts miles', () => {
    const description = 'It has 5 miles.';

    const convertedDescription = convertComplexStringUnits(description);

    expect(convertedDescription).toEqual('It has 7.5 kilometers.');
  });

  describe('converts feet', () => {
    it('to meters', () => {
      const description = 'It has 20 feet.';

      const convertedDescription = convertComplexStringUnits(description);

      expect(convertedDescription).toEqual('It has 6 meters.');
    });

    it('to centimeters', () => {
      const description = 'It has 4 feet.';

      const convertedDescription = convertComplexStringUnits(description);

      expect(convertedDescription).toEqual('It has 120 centimeters.');
    });
  });

  describe('converts number-foot-suffix', () => {
    it('to meter-suffix', () => {
      const description = 'It is 20-foot-suffix.';

      const convertedDescription = convertComplexStringUnits(description);

      expect(convertedDescription).toEqual('It is 6-meter-suffix.');
    });

    it('to number-centimeter-suffix', () => {
      const description = 'It is 4-foot-suffix.';

      const convertedDescription = convertComplexStringUnits(description);

      expect(convertedDescription).toEqual('It is 120-centimeter-suffix.');
    });
  });

  describe('converts foot-suffix', () => {
    it('to meter-high', () => {
      const description = 'It is 20 foot-suffix.';

      const convertedDescription = convertComplexStringUnits(description);

      expect(convertedDescription).toEqual('It is 6 meter-suffix.');
    });

    it('to centimeter-suffix', () => {
      const description = 'It is 4 foot-suffix.';

      const convertedDescription = convertComplexStringUnits(description);

      expect(convertedDescription).toEqual('It is 120 centimeter-suffix.');
    });
  });

  describe('for height values', () => {
    it('converts 5 feet', () => {
      const description = 'It has 5 feet.';

      const convertedDescription = convertComplexStringUnits(description);

      expect(convertedDescription).toEqual('It has 1.5 meter.');
    });

    it('converts 6 feet', () => {
      const description = 'It has 6 feet.';

      const convertedDescription = convertComplexStringUnits(description);

      expect(convertedDescription).toEqual('It has 1.8 meter.');
    });

    it('converts 7 feet', () => {
      const description = 'It has 7 feet.';

      const convertedDescription = convertComplexStringUnits(description);

      expect(convertedDescription).toEqual('It has 2.1 meter.');
    });
  });

  it('converts square feet', () => {
    const description = 'It has 20 000 square feet.';

    const convertedDescription = convertComplexStringUnits(description);

    expect(convertedDescription).toEqual('It has 2000 square meters.');
  });

  it('converts inches', () => {
    const description = 'It has 5 inches.';

    const convertedDescription = convertComplexStringUnits(description);

    expect(convertedDescription).toEqual('It has 12.5 centimeters.');
  });

  it('converts inch', () => {
    const description = 'It has 1 inch.';

    const convertedDescription = convertComplexStringUnits(description);

    expect(convertedDescription).toEqual('It has 2.5 centimeters.');
  });

  it('converts gallons', () => {
    const description = 'It has 3 gallons.';

    const convertedDescription = convertComplexStringUnits(description);

    expect(convertedDescription).toEqual('It has 12 liters.');
  });

  describe('converts pounds to kilograms', () => {
    it('for single value', () => {
      const description = 'It has 80 pounds.';

      const convertedDescription = convertComplexStringUnits(description);

      expect(convertedDescription).toEqual('It has 36 kilograms.');
    });

    it('for values between', () => {
      const description = 'It has between 50 and 100 pounds.';

      const convertedDescription = convertComplexStringUnits(description);

      expect(convertedDescription).toEqual(
        'It has between 22 and 45 kilograms.',
      );
    });
  });
});
