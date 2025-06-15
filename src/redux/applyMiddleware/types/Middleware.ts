import type { Dispatch } from '../../createStore';

export interface MiddlewareAPI<S = unknown, D = Dispatch> {
  dispatch: D;
  getState: () => S;
}

export interface Middleware<
  S = unknown,
  D = Dispatch,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  DispatchExt = object, // TODO: see if this can be used in type definition somehow (can't be removed, as is used to get final dispatch type)
> {
  (api: MiddlewareAPI<S, D>): (next: (action: unknown) => unknown) => (action: unknown) => unknown;
}
