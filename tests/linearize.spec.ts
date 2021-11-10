import { linearize } from '../src/linearize';

describe('linearize', () => {
  describe('when first or last index exceeds arguments or output array length', () => {
    it('throws an error', () => {
      expect(() => linearize(10, 20, (x) => x, [1, 2], [3, 4, 5]))
        .toThrow();
    });
  });
});
