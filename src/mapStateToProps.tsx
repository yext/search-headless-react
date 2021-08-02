import { ComponentType, useMemo, useReducer, ComponentState } from 'react';
import { Unsubscribe } from '@reduxjs/toolkit';
import { State } from '@yext/answers-headless/lib/esm/models/state';
import { useAnswersActions } from './useAnswersActions';

type StateMappingFunc = (s: State) => AnyProps;
type AnyProps = Record<string, unknown>;
type HOC = (props: AnyProps) => JSX.Element;

// TODO(SLAP-1482): Add hook version
export function mapStateToProps(mapStateToProps: StateMappingFunc) {
  // TODO: find out how to specify generic component props without using `any`
  // I sank a 3-4 hours into this but couldn't figure out exactly how to get it to work.
  // May require use of typescript generics.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function generateListenerComponentFunction(WrappedComponent: ComponentType<any>): HOC {
    let unsubscribeCallback: Unsubscribe;

    return function StatefulCoreListener(props: AnyProps) {
      const storeActions = useAnswersActions();
      if (unsubscribeCallback) {
        unsubscribeCallback();
      }
      unsubscribeCallback = storeActions.addListener({
        valueAccessor: (state: State) => state,
        callback: (state: State) => dispatch(state)
      });
      const mergeWithOriginalProps = (_componentState: ComponentState, coreState: State) => ({
        ...props,
        ...mapStateToProps(coreState)
      });
      const [mergedProps, dispatch] = useReducer(mergeWithOriginalProps, props);
      return useMemo(() => <WrappedComponent {...mergedProps}/>, [mergedProps]);
    };
  };
}
