interface Identity {
  <A>(arg: A): A;
  <T extends unknown[]>(...args: T): T;
}

export default function compose(): Identity;

export default function compose<F extends Function>(f: F): F;

export default function compose<Args extends unknown[], ReturnValue>(
  f: Func<Args, ReturnValue>,
): Func<Args, ReturnValue>;

export default function compose<A, Args extends unknown[], ReturnValue>(
  f1: (a: A) => ReturnValue,
  f2: Func<Args, A>,
): Func<Args, ReturnValue>;

export default function compose<A, B, Args extends unknown[], ReturnValue>(
  f1: (b: B) => ReturnValue,
  f2: (a: A) => B,
  f3: Func<Args, A>,
): Func<Args, ReturnValue>;

export default function compose<A, B, C, Args extends unknown[], ReturnValue>(
  f1: (c: C) => ReturnValue,
  f2: (b: B) => C,
  f3: (a: A) => B,
  f4: Func<Args, A>,
): Func<Args, ReturnValue>;

export default function compose<ReturnValue>(
  f1: (...args: any[]) => ReturnValue,
  ...funcs: Function[]
): (...args: unknown[]) => ReturnValue;

export default function compose<ReturnValue>(
  ...funcs: Function[]
): (...args: unknown[]) => ReturnValue;

export default function compose(...funcs: Function[]): Function {
  if (funcs.length === 0) {
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
}
