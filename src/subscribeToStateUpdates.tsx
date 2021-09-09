// TODO(SLAP-1485): find out how to specify generic component props without using `any`
// I sank a 3-4 hours into this but couldn't figure out exactly how to get it to work.
// May require use of typescript generics.

/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType, useReducer, useEffect, useContext } from 'react';
import { State } from '@yext/answers-headless/lib/esm/models/state';
import { useAnswersActions } from './useAnswersActions';
import { AnswersActionsContext } from '.';

type SubscriberGenerator = (WrappedComponent: ComponentType<any>) => (props: any) => JSX.Element;

/**
 * Generates a HOC that updates a given Component's props based on the current
 * answers-headless state and a given mapping function.
 */
export function subscribeToStateUpdates(mapStateToProps: (s: State) => Record<string, any>): SubscriberGenerator {
  const generateSubscriberHOC: SubscriberGenerator = WrappedComponent => {
    // Keep manual track of the mappedState instead of storing it in the component's state.
    // This avoids react's batching of state updates, which can result in mappedState not updating immediately.
    // This can, in turn, result in extra stateful-core listener invocations.
    let mappedState = {};
    return function StatefulCoreSubscriber(props: Record<string, any>) {
      const statefulCore = useContext(AnswersActionsContext);
      const answersActions = useAnswersActions();
      const [mergedProps, dispatch] = useReducer(() => {
        return {
          ...props,
          ...mappedState
        };
      }, { ...props, ...mapStateToProps(statefulCore.state) });

      const statefulCoreListener = newMappedState => {
        const dispatchMappedState = () => {
          mappedState = newMappedState;
          dispatch();
        };
        const newStatePropKeys = Object.keys(newMappedState);
        if (newStatePropKeys.length !== Object.keys(newStatePropKeys).length) {
          dispatchMappedState();
          return;
        }
        for (const key of newStatePropKeys) {
          const isNewProp = !(key in mappedState);
          const isUpdatedProp = mappedState[key] !== newMappedState[key];
          if (isNewProp || isUpdatedProp) {
            dispatchMappedState();
            return;
          }
        }
      };
      useEffect(() => {
        return answersActions.addListener({
          valueAccessor: (state: State) => mapStateToProps(state),
          callback: statefulCoreListener
        });
      });
      return <WrappedComponent {...mergedProps}/>;
    };
  };
  return generateSubscriberHOC;
}
