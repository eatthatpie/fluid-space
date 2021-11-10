export type LinearFunction = (x: number) => number;

export function createLinearFunction(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): LinearFunction {
  const a = (y2 - y1) / (x2 - x1);
  const b = y1 - a * x1;

  return (x: number) => a * x + b;
}
