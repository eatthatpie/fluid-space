import { ArrayKeyValue, Maybe, SpaceValue } from './types';

// Variant 1
// Time: O(n)
// Memory: O(n)
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

  const out: number[] = new Array(breakpoints.length);

  let memIndex: number | null = null;

  breakpoints.forEach((curr, index) => {
    out[curr.index] = curr.value;

    if (index === 0) {
      if (curr.index !== 0) {
        memIndex = curr.index;
      }

      return;
    }

    const prev = breakpoints[index - 1];

    const a = (curr.value - prev.value) / (resolutions[curr.index] - resolutions[prev.index]);
    const b = prev.value - a * resolutions[prev.index];

    const func = (x: number) => a * x + b;

    if (memIndex !== null) {
      for (let i = memIndex - 1; i >= 0; i--) {
        out[i] = func(resolutions[i]);
      }

      memIndex = null;
    } else {
      for (let i = curr.index - 1; i > prev.index; i--) {
        out[i] = func(resolutions[i]);
      }
    }

    if (index === breakpoints.length - 1 && curr.index < resolutions.length - 1) {
      for (let i = curr.index + 1; i < resolutions.length; i++) {
        out[i] = func(resolutions[i]);
      }
    }
  });

  return out;
}
