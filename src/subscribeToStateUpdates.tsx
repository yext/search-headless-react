// TODO(SLAP-1485): find out how to specify generic component props without using `any`
// I sank a 3-4 hours into this but couldn't figure out exactly how to get it to work.
// May require use of typescript generics.

/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType, useReducer, useEffect, useContext } from 'react';
import { State } from '@yext/answers-headless/lib/esm/models/state';
import { AnswersActionsContext } from '.';
import isShallowEqual from './utils/isShallowEqual';

type SubscriberGenerator = (WrappedComponent: ComponentType<any>) => (props: any) => JSX.Element;

/**
 * Generates a HOC that updates a given Component's props based on the current
 * answers-headless state and a given mapping function.
 */
export function subscribeToStateUpdates(mapStateToProps: (s: State) => Record<string, unknown>): SubscriberGenerator {
  const generateSubscriberHOC: SubscriberGenerator = WrappedComponent => {
    // Keep manual track of the mappedState instead of storing it in the component's state.
    // This avoids react's batching of state updates, which can result in mappedState not updating immediately.
    // This can, in turn, result in extra stateful-core listener invocations.
    let mappedState = {};
    return function StatefulCoreSubscriber(props: Record<string, unknown>) {
      const statefulCore = useContext(AnswersActionsContext);
      const [mergedProps, dispatch] = useReducer(() => {
        return {
          ...props,
          ...mappedState
        };
      }, { ...props, ...mapStateToProps(statefulCore.state) });

      useEffect(() => {
        return statefulCore.addListener({
          valueAccessor: (state: State) => mapStateToProps(state),
          callback: newMappedState => {
            if (!isShallowEqual(mappedState, newMappedState)) {
              mappedState = newMappedState;
              dispatch();
            }
          }
        });
      });
      return <WrappedComponent {...mergedProps}/>;
    };
  };
  return generateSubscriberHOC;
}
