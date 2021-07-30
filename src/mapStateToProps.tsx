import { ComponentType, useMemo, useReducer } from 'react';
import { Unsubscribe } from '@reduxjs/toolkit';
import { State } from '@yext/answers-headless/lib/esm/models/state';
import { useStoreActions } from './useStoreActions';

type StateReducer = (s: State) => any;

// TODO: Add hook version, useStoreState
export function mapStateToProps(mapStateToProps: StateReducer) {
  return function generateListenerComponentFunction(WrappedComponent: ComponentType<any>) {
    let unsubscribeCallback: Unsubscribe;

    return function StatefulCoreListener(props: any) {
      const storeActions = useStoreActions();
      if (unsubscribeCallback) {
        unsubscribeCallback();
      }
      unsubscribeCallback = storeActions.addListener({
        valueAccessor: (state: State) => state,
        callback: (state: State) => dispatch(state)
      });
      const coreReducer = (_componentState: any, coreState: State) => ({
        ...props,
        ...mapStateToProps(coreState)
      });
      const [mergedProps, dispatch] = useReducer(coreReducer, props);
      return useMemo(() => <WrappedComponent {...mergedProps}/>, [mergedProps]);
    }
  }
}
