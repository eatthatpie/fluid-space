import { Maybe, SpaceValue } from '../src/types';
import { linearizeSpace } from '../src/linearize-space';

describe('Examples', () => {
  describe('when space values array is longer than resolutions array', () => {
    it('throws error', () => {
      expect(() => linearizeSpace([1, 2, 3], [1, 2])).toThrow();
    });
  });

  describe('when space value array is no longer than resolutions array', () => {
    const resolutionsArray = [500, 1000, 2000, 2500, 3000];

    it.each<[SpaceValue, number[], Maybe<number | number[]>]>([
      [10, resolutionsArray, 10],
      [2, resolutionsArray, 2],
      [[1, 2, 3, 4, 5], resolutionsArray, [1, 2, 3, 4, 5]],
      [[5, null, null, 25, null], resolutionsArray, [5, 10, 20, 25, 30]],
      [[null, 5, 10, null], resolutionsArray, [2.5, 5, 10, 12.5, 15]],
      [[1, 2], resolutionsArray, [1, 2, 4, 5, 6]],
      [[null, 10], resolutionsArray, 10],
      [[null, undefined, null, null], resolutionsArray, null],
      [[5, null, 20, null, 0], resolutionsArray, [5, 10, 20, 10, 0]]
    ])('linearizeSpace(%p, %p) returns %p', (spaceValue, resolutionsArray, expectedResult) => {
      expect(linearizeSpace(spaceValue, resolutionsArray)).toEqual((expectedResult));
    })
  });
});
