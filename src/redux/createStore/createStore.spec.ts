import { describe, it, expect, mock } from 'bun:test';
import type { Action } from './types/Action';
import type { Reducer } from './types/Reducer';
import type { Store } from './types/Store';
import type { Enhancer } from './types/Enhancer';
import createStore from '.';

describe('createStore', () => {
  it('should initialize state using reducer', () => {
    type State = { count: number };
    const reducer: Reducer<State> = (state = { count: 0 }, action) => {
      switch (action.type) {
        default:
          return state;
      }
    };

    const store = createStore(reducer);
    expect(store.getState()).toEqual({ count: 0 });
  });

  it('dispatch should update state and return the action', () => {
    type State = { count: number };
    const INCREMENT = 'INCREMENT' as const;
    type IncrementAction = Action<typeof INCREMENT>;

    const reducer: Reducer<State, IncrementAction> = (state = { count: 0 }, action) => {
      switch (action.type) {
        case INCREMENT:
          return { count: state.count + 1 };
        default:
          return state;
      }
    };

    const store = createStore(reducer);
    const action: IncrementAction = { type: INCREMENT };
    const returned = store.dispatch(action);

    expect(returned).toBe(action);
    expect(store.getState()).toEqual({ count: 1 });
  });

  it('subscribe should register listener and unsubscribe should remove it', () => {
    const ADD = 'ADD' as const;
    type AddAction = Action<typeof ADD>;

    const reducer: Reducer<number, AddAction> = (state = 0, action) =>
      action.type === ADD ? state + 1 : state;

    const store: Store<number, AddAction> = createStore(reducer);

    const listener = mock(() => {});

    const unsubscribe = store.subscribe(listener);

    store.dispatch({ type: ADD });
    expect(listener).toHaveBeenCalledTimes(1);

    store.dispatch({ type: ADD });
    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();

    store.dispatch({ type: ADD });
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('should support enhancers', () => {
    type StoreExt = { enhanced: boolean };
    type StateExt = { extraField: string };
    const enhancer: Enhancer<StoreExt, StateExt> = next => reducer => {
      const store = next(reducer);
      return {
        ...store,
        enhanced: true,
        getState: () => {
          const state = store.getState() as ReturnType<typeof store.getState> & StateExt;
          state.extraField = 'someExtraValue';
          return state;
        },
      };
    };

    const reducer: Reducer<{ initial: true }> = (state = { initial: true }, _) => state;
    const store = createStore(reducer, enhancer);

    expect(store.enhanced).toBe(true);
    expect(store.getState()).toEqual({ initial: true, extraField: 'someExtraValue' });
  });

  it('should catch errors in reducer and not notify listeners', () => {
    const ERROR = 'ERROR' as const;
    type ErrorAction = Action<typeof ERROR>;

    const reducer: Reducer<number, ErrorAction> = (state = 0, action) => {
      if (action.type === ERROR) throw new Error('Test error');
      return state;
    };
    const store: Store<number, ErrorAction> = createStore(reducer);

    const listener = mock(() => {});

    store.subscribe(listener);

    expect(() => store.dispatch({ type: ERROR })).not.toThrow();
    expect(listener).not.toBeCalled();
  });
});
