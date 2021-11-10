export type ArrayKeyValue<T> = {
  index: number;
  value: T;
}
export type Maybe<T> = T | null | undefined;
export type SpaceValue = number | Maybe<number>[];
