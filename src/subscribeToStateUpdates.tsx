// TODO(SLAP-1485): find out how to specify generic component props without using `any`
// I sank a 3-4 hours into this but couldn't figure out exactly how to get it to work.
// May require use of typescript generics.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType, useMemo, useReducer, ComponentState } from 'react';
import { Unsubscribe } from '@reduxjs/toolkit';
import { State } from '@yext/answers-headless/lib/esm/models/state';
import { useAnswersActions } from './useAnswersActions';

type StateMappingFunc = (s: State) => AnyProps;
type AnyProps = Record<string, unknown>;
type HOC = (props: AnyProps) => JSX.Element;
type SubscriberGenerator = (WrappedComponent: ComponentType<any>) => HOC;

/**
 * Generates a HOC that updates a given Component's props based on the current
 * answers-headless state and a given mapping function.
 *
 * TODO(SLAP-1482): Add hook version
 */
export function subscribeToStateUpdates(mapStateToProps: StateMappingFunc): SubscriberGenerator {
  const generateSubscriberHOC: SubscriberGenerator = WrappedComponent => {
    let unsubscribeCallback: Unsubscribe;

    return function StatefulCoreSubscriber(props: AnyProps) {
      const answersActions = useAnswersActions();
      if (unsubscribeCallback) {
        unsubscribeCallback();
      }
      unsubscribeCallback = answersActions.addListener({
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
  return generateSubscriberHOC;
}
