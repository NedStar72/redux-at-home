import type { Action } from './Action';
import type { Reducer } from './Reducer';
import type { Store } from './Store';

export interface EnhancedStoreCreator<
  StoreExt extends UnknownObject = UnknownObject,
  StateExt extends UnknownObject = UnknownObject,
> {
  <S, A extends Action>(reducer: Reducer<S, A>): Store<S & StateExt, A> & StoreExt;
}

export interface Enhancer<
  StoreExt extends UnknownObject = UnknownObject,
  StateExt extends UnknownObject = UnknownObject,
> {
  <NextStoreExt extends UnknownObject, NextStateExt extends UnknownObject>(
    next: EnhancedStoreCreator<NextStoreExt, NextStateExt>,
  ): EnhancedStoreCreator<NextStoreExt & StoreExt, NextStateExt & StateExt>;
}
