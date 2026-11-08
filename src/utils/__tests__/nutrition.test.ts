import { progress, scaleNutrients, sumNutrients } from '../nutrition';

describe('scaleNutrients', () => {
  const per100g = { calories: 200, protein: 10, carbs: 30, fat: 5 };

  it('returns the same values for 100 g', () => {
    expect(scaleNutrients(per100g, 100)).toEqual(per100g);
  });

  it('scales values for 150 g', () => {
    expect(scaleNutrients(per100g, 150)).toEqual({ calories: 300, protein: 15, carbs: 45, fat: 7.5 });
  });

  it('rounds calories to whole numbers and grams to 1 decimal', () => {
    const result = scaleNutrients({ calories: 333, protein: 3.33, carbs: 1.11, fat: 0.07 }, 33);
    expect(result).toEqual({ calories: 110, protein: 1.1, carbs: 0.4, fat: 0 });
  });
});

describe('sumNutrients', () => {
  it('returns zeros for an empty list', () => {
    expect(sumNutrients([])).toEqual({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  });

  it('adds many items together without floating point noise', () => {
    const items = [
      { calories: 100, protein: 0.1, carbs: 10, fat: 1 },
      { calories: 250, protein: 0.2, carbs: 20.5, fat: 2.2 },
    ];
    expect(sumNutrients(items)).toEqual({ calories: 350, protein: 0.3, carbs: 30.5, fat: 3.2 });
  });
});

describe('progress', () => {
  it('returns a value between 0 and 1', () => {
    expect(progress(500, 2000)).toBe(0.25);
    expect(progress(3000, 2000)).toBe(1);
    expect(progress(-10, 2000)).toBe(0);
  });

  it('returns 0 when the goal is 0', () => {
    expect(progress(100, 0)).toBe(0);
  });
});
