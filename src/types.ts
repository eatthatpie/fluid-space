export type ArrayKeyValue<T> = {
  index: number;
  value: T;
}
export type Maybe<T> = T | null | undefined;
export type Nullable<T> = T | null;
export type SpaceValue = number | Maybe<number>[];
