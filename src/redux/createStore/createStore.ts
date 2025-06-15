import { randomString } from '../utils';
import type { Action } from './types/Action';
import type { Dispatch } from './types/Dispatch';
import type { Reducer } from './types/Reducer';
import type { Listener, Store, Unsubscribe } from './types/Store';
import type { Enhancer } from './types/Enhancer';

export const InternalActionType = {
  Initial: `@@redux/INIT${randomString()}`,
};

const createStore = <
  S,
  A extends Action,
  StoreExt extends UnknownObject = UnknownObject,
  StateExt extends UnknownObject = UnknownObject,
>(
  reducer: Reducer<S, A>,
  enhancer?: Enhancer<StoreExt, StateExt>,
): Store<S & StateExt, A> & StoreExt => {
  if (enhancer) {
    return enhancer(createStore)(reducer);
  }

  let state: S | undefined;
  const listeners: Map<number, Listener> = new Map();
  let listenerIdCounter = 0;

  const dispatch = (action: A): A => {
    try {
      state = reducer(state, action);

      for (const listener of listeners.values()) {
        listener();
      }
    } catch {
      // do nothing
    }

    return action;
  };

  const getState = (): S => {
    return state as S;
  };

  const subscribe = (listener: Listener): Unsubscribe => {
    const listenerId = listenerIdCounter++;
    listeners.set(listenerId, listener);

    return () => {
      listeners.delete(listenerId);
    };
  };

  dispatch({ type: InternalActionType.Initial } as A);

  return {
    dispatch: dispatch as Dispatch<A>,
    getState,
    subscribe,
  } as Store<S & StateExt, A> & StoreExt;
};

export default createStore;
