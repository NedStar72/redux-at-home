import type { Reducer } from '../createStore';

type CombinedReducerState<M> =
  M[keyof M] extends Reducer<any, any>
    ? {
        [Slice in keyof M]: M[Slice] extends Reducer<infer State, any> ? State : never;
      }
    : never;

type CombinedReducerAction<M> = Expand<
  {
    [Slice in keyof M]: M[Slice] extends Reducer<any, infer A> ? A : never;
  }[keyof M]
>;

type CombinedReducer<M> =
  M[keyof M] extends Reducer<any, any>
    ? Reducer<CombinedReducerState<M>, CombinedReducerAction<M>>
    : never;

const combineReducers = <ReducersMapObject extends Record<string, Reducer<any, any>>>(
  reducersMapObject: ReducersMapObject,
): CombinedReducer<ReducersMapObject> => {
  return ((
    state: CombinedReducerState<ReducersMapObject> = {} as CombinedReducerState<ReducersMapObject>,
    action: CombinedReducerAction<ReducersMapObject>,
  ) => {
    let hasChanged = false;
    const nextState = {} as CombinedReducerState<ReducersMapObject>;
    for (const key in reducersMapObject) {
      const reducer = reducersMapObject[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
      nextState[key] = nextStateForKey;
    }
    return hasChanged ? nextState : state;
  }) as CombinedReducer<ReducersMapObject>;
};

export default combineReducers;
