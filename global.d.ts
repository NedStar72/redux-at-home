declare global {
  type UnknownObject = Record<string, unknown>;

  type Func<T extends unknown[], R> = (...a: T) => R;

  type ExtendIfNotNever<T, U> = [U] extends [never] ? T : T & U;

  type MergeObjects<T, U> = {
    [K in keyof T | keyof U]: K extends keyof U ? U[K] : K extends keyof T ? T[K] : never;
  };

  type ExtendObjectsIfNotNever<T extends object, U extends object> = [U] extends [never]
    ? T
    : MergeObjects<T, U>;
}

export {};
