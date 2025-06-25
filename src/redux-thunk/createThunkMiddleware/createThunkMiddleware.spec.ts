import { describe, it, expect, mock } from 'bun:test';
import type { UnknownAction } from '../../redux/createStore';
import type { ThunkAction } from './types';
import createThunkMiddleware from './createThunkMiddleware';

describe('ThunkMiddleware', () => {
  it('should run the given action function with dispatch and getState', () => {
    const api = {
      dispatch: mock(),
      getState: mock(),
    };
    const next = mock();
    const thunkAction: ThunkAction<UnknownAction, string, never, void> = (dispatch, getState) => {
      expect(dispatch).toBe(api.dispatch);
      expect(getState).toBe(api.getState);
    };

    createThunkMiddleware()(api)(next)(thunkAction);
  });

  it('should pass action to next if not a function', () => {
    const api = {
      dispatch: mock(),
      getState: mock(),
    };
    const next = mock();
    const action: UnknownAction = { type: 'TestAction' };

    createThunkMiddleware()(api)(next)(action);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenNthCalledWith(1, action);
  });

  it('should return the return value of next if not a function', () => {
    const api = {
      dispatch: mock(),
      getState: mock(),
    };
    const next = (action: unknown) => action;
    const action: UnknownAction = { type: 'TestAction' };

    const result = createThunkMiddleware()(api)(next)(action);

    expect(result).toBe(action);
  });

  it('should return value as expected if a function', () => {
    const api = {
      dispatch: mock(),
      getState: mock(),
    };
    const next = mock();
    const thunkAction: ThunkAction<UnknownAction, string, never, void> = () => {
      return 'result';
    };

    const result = createThunkMiddleware()(api)(next)(thunkAction);
    expect(result).toBe('result');
  });

  it('should be invoked synchronously if a function', () => {
    let mutated = 0;

    const api = {
      dispatch: mock(),
      getState: mock(),
    };
    const next = mock();
    const thunkAction: ThunkAction<UnknownAction, string, never, void> = () => {
      mutated += 1;
    };

    createThunkMiddleware()(api)(next)(thunkAction);
    expect(mutated).toBe(1);
  });

  it('should pass the extra argument', () => {
    const extra = { lol: true };
    const api = {
      dispatch: mock(),
      getState: mock(),
    };
    const next = mock();
    const thunkAction: ThunkAction<UnknownAction, string, typeof extra, void> = (
      _,
      __,
      extraArg,
    ) => {
      expect(extraArg).toBe(extra);
    };

    createThunkMiddleware(extra)(api)(next)(thunkAction);
  });
});
