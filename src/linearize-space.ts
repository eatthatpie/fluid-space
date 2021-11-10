import { ArrayKeyValue, Maybe, Nullable, SpaceValue } from './types';
import { createLinearFunction } from './create-linear-function';
import { linearize } from './linearize';

/**
 * Since given example values do not cover not continuously linear spaceValue and resolutions relation, like for instance:
 *   spaceValue:  [5, 10, 15, null, 100]
 *   resolutions: [1000, 1200, 1500, 2100, 2200]
 * I needed to extend the specs.
 *
 * After analyzing values from example I assumed that for given:
 *   spaceValue:  [null, null, V1, null, null, V2, null]
 *   resolutions: [R1, R2, R3, R4, R5, R6, R7]
 * the output should be calculated as follows:
 * - value at index 0 should be calculated with linear function determined by V1, V2, R1, R3 and R6,
 * - value at index 1 should be calculated with linear function determined by V1, V2, R2, R3 and R6,
 * - value at index 3 should be calculated with linear function determined by V1, V2, R3, R4 and R6,
 * - value at index 4 should be calculated with linear function determined by V1, V2, R3, R5 and R6,
 * - value at index 6 should be calculated with linear function determined by V1, V2, R3, R6 and R7.
 *
 * So, in other words: calculating values placed "between" space values is straightforward. As for undefined (or null) values:
 * - placed before the first space value is calculated with extended linear function calculated with first and following space value,
 * - placed after the last space value is calculated with extended linear function calculated with last and preceding value.
 *
 * Algorithm specs:
 * Time: O(n)
 * Memory: O(n)
 * n - spaceValue array size
 *
 * Note: there are loops inside breakpoints.forEach loop, but since they iterate over limited number of items
 * the complexity is O(const * n) rather than O(n^2). For example, having sapceValue array like:
 * [V1, null, V2, null, V3, null, ... V50, null]
 * The breakpoints.forEach will run 50 times and inner loops will iterate 1-2 times each.
 */
export function linearizeSpace(spaceValue: SpaceValue, resolutions: number[]): Maybe<number | number[]> {
  if (!Array.isArray(spaceValue)) {
    return spaceValue;
  }

  if (Array.isArray(spaceValue) && spaceValue.length > resolutions.length) {
    throw new Error('');
  }

  const breakpoints: ArrayKeyValue<number>[] = [];

  spaceValue.forEach((value, index) => {
    if (value !== null && value !== undefined) {
      breakpoints.push({
        index,
        value
      })
    }
  });

  if (!breakpoints.length) {
    return null;
  }

  if (breakpoints.length === 1) {
    return breakpoints[0].value;
  }

  const out: number[] = new Array(resolutions.length);

  // Memoized first breakpoint non-zero index.
  let memIndex: Nullable<number> = null;

  breakpoints.forEach((curr, index) => {
    out[curr.index] = curr.value;

    if (index === 0) {
      if (curr.index !== 0) {
        memIndex = curr.index;
      }

      return;
    }

    const prev = breakpoints[index - 1];

    const func = createLinearFunction(
      resolutions[prev.index],
      prev.value,
      resolutions[curr.index],
      curr.value
    );

    // Left side of breakpoint.
    if (memIndex !== null) {
      linearize(0, memIndex - 1, func, resolutions, out);

      memIndex = null;
    } else {
      linearize(prev.index + 1, curr.index - 1, func, resolutions, out);
    }

    // Right side of breakpoint.
    if (index === breakpoints.length - 1 && curr.index < resolutions.length - 1) {
      linearize(curr.index + 1, resolutions.length - 1, func, resolutions, out);
    }
  });

  return out;
}
