import type { Action, UnknownAction, Middleware } from '../../redux';

export type ThunkAction<BasicAction extends Action, State, ExtraThunkArg, ReturnType> = (
  dispatch: ThunkDispatch<BasicAction, State, ExtraThunkArg>,
  getState: () => State,
  extraArgument: ExtraThunkArg,
) => ReturnType;

export interface ThunkDispatch<BasicAction extends Action, State, ExtraThunkArg> {
  <Action extends BasicAction>(action: Action): Action;

  <ReturnType>(thunkAction: ThunkAction<BasicAction, State, ExtraThunkArg, ReturnType>): ReturnType;

  <ReturnType, A extends BasicAction>(
    action: A | ThunkAction<BasicAction, State, ExtraThunkArg, ReturnType>,
  ): A | ReturnType;
}

export type ThunkMiddleware<
  State extends UnknownObject = EmptyObject,
  BasicAction extends Action = UnknownAction,
  ExtraThunkArg = undefined,
> = Middleware<
  State,
  ThunkDispatch<BasicAction, State, ExtraThunkArg>,
  ThunkDispatch<BasicAction, State, ExtraThunkArg>
>;
