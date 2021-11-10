import { LinearFunction } from './create-linear-function';

export function linearize(
  startIndex: number,
  lastIndex: number,
  func: LinearFunction,
  argumentsArray: number[],
  output: number[]
) {
  if (
    startIndex >= argumentsArray.length
    || startIndex >= output.length
    || lastIndex >= argumentsArray.length
    || lastIndex >= output.length
  ) {
    throw new Error('');
  }

  for (let i = startIndex; i <= lastIndex; i++) {
    output[i] = func(argumentsArray[i]);
  }
}
