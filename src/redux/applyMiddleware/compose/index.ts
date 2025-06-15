interface Identity {
  <A>(arg: A): A;
  <T extends unknown[]>(...args: T): T;
}

interface Compose {
  (): Identity;
  <F>(f: F): F;
  <Args extends unknown[], ReturnValue>(f: Func<Args, ReturnValue>): Func<Args, ReturnValue>;
  <A, Args extends unknown[], ReturnValue>(
    f1: (a: A) => ReturnValue,
    f2: Func<Args, A>,
  ): Func<Args, ReturnValue>;
  <A, B, Args extends unknown[], ReturnValue>(
    f1: (b: B) => ReturnValue,
    f2: (a: A) => B,
    f3: Func<Args, A>,
  ): Func<Args, ReturnValue>;
  <A, B, C, Args extends unknown[], ReturnValue>(
    f1: (c: C) => ReturnValue,
    f2: (b: B) => C,
    f3: (a: A) => B,
    f4: Func<Args, A>,
  ): Func<Args, ReturnValue>;
  <ReturnValue>(
    f1: (a: unknown) => ReturnValue,
    ...funcs: Function[]
  ): (...args: unknown[]) => ReturnValue;
  <ReturnValue>(...funcs: Function[]): (...args: unknown[]) => ReturnValue;
}

/**
 * compose(a,b,c) -> (..args) => a(b(c(...args)))
 */
const compose = ((...funcs: Function[]) => {
  if (funcs.length === 0) {
    // infer the argument type so it is usable in inference down the line
    return <T>(arg: T) => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(
    (a, b) =>
      (...args: unknown[]) =>
        a(b(...args)),
  );
}) as Compose;

export default compose;
