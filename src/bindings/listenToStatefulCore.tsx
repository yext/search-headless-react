import { ComponentType, useMemo, useReducer } from 'react';
import { Unsubscribe } from '@reduxjs/toolkit';
import { State } from '@yext/answers-headless/lib/esm/models/state';
import { useStatefulCore } from './useStatefulCore';

type StateReducer = (s: State) => any;

// Add hook version, useStoreState
// stateToProps, decoratePropsWithState?
export function listenToStatefulCore(mapStateToProps: StateReducer) {
  return function generateListenerComponentFunction(WrappedComponent: ComponentType<any>) {
    let unsubscribeCallback: Unsubscribe;

    return function StatefulCoreListener(props: any) {
      const statefulCore = useStatefulCore();
      if (unsubscribeCallback) {
        unsubscribeCallback();
      }
      unsubscribeCallback = statefulCore.addListener({
        valueAccessor: (state: State) => state,
        callback: (state: State) => dispatch(state)
      });
      const coreReducer = (_componentState: any, coreState: State) => ({
        ...props,
        ...mapStateToProps(coreState)
      });
      const [mergedProps, dispatch] = useReducer(coreReducer, props);
      // return <WrappedComponent {...mergedProps}/>;
      return useMemo(() => <WrappedComponent {...mergedProps}/>, [mergedProps]);
    }
  }
}
