import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { State } from '@yext/answers-headless';
import { AnswersHeadlessContext } from './AnswersHeadlessContext';
import useLayoutEffect from 'use-isomorphic-layout-effect';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector';

export type StateSelector<T> = (s: State) => T;

const canUseDOM = !!(typeof window !== 'undefined'
  && typeof window.document !== 'undefined'
  && typeof window.document.createElement !== 'undefined');
const isServerEnvironment = !canUseDOM;

/**
 * use-sync-external-store/shim does not support getServerSnapshot for pre-18 React versions.
 * It requires user of the shim to handle subscription logic and return the correct snapshot value.
 * As such, server side rendering from pre-18 React version will use a version of useAnswersState that
 * manually handle memoization of state selector and register subscription without useSyncExternalStore call.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useAnswersState = (React as any).useSyncExternalStore === undefined && isServerEnvironment
  ? useAnswersStateWithManualStoreSync : useAnswersStateWithReactStoreSync;


/**
 * Returns the Answers State returned by the map function.
 * UseSyncExternalStoreWithSelector is used to subscribe to external store and trigger rerender
 * whenever an action is dispatched and caused changes to the state of the selector function.
 */
function useAnswersStateWithReactStoreSync<T>(stateSelector: StateSelector<T>): T {
  const answers = useContext(AnswersHeadlessContext);
  if (answers.state === undefined) {
    throw new Error('Attempted to call useAnswersState() outside of AnswersHeadlessProvider.'
     + ' Please ensure that \'useAnswersState()\' is called within an AnswersHeadlessProvider component.');
  }

  const getSnapshot = useCallback(() => answers.state, [answers.state]);
  const isMountedRef = useRef<boolean>(false);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const subscribe = useCallback(cb =>
    answers.addListener({
      valueAccessor: state => state,
      callback: () => {
        // prevent React state update on an unmounted component
        if (!isMountedRef.current) {
          return;
        }
        cb();
      }
    }), [answers]);

  const selectedState = useSyncExternalStoreWithSelector(
    subscribe,
    getSnapshot,
    getSnapshot,
    stateSelector
  );
  return selectedState;
}


/**
 * Returns the Answers State returned by the map function.
 * Very similar to useSelector in react-redux.
 */
function useAnswersStateWithManualStoreSync<T>(stateSelector: StateSelector<T>): T {
  const answers = useContext(AnswersHeadlessContext);
  if (answers.state === undefined) {
    throw new Error('Attempted to call useAnswersState() outside of AnswersHeadlessProvider.'
     + ' Please ensure that \'useAnswersState()\' is called within an AnswersHeadlessProvider component.');
  }

  // useRef stores values across renders without triggering additional ones
  const storedStoreState = useRef<State>(answers.state);
  const storedSelector = useRef<StateSelector<T>>(stateSelector);
  const storedSelectedState = useRef<T>();
  /**
   * Guard execution of {@link stateSelector} for initializing storedSelectedState.
   * Otherwise it's run an additional time every render, even when storedSelectedState is already initialized.
   */
  if (storedSelectedState.current === undefined) {
    storedSelectedState.current = stateSelector(answers.state);
  }

  /**
   * The currently selected state - this is the value returned by the hook.
   * Tries to use {@link storedSelectedState} when possible.
   */
  const selectedStateToReturn: T = (() => {
    if (storedStoreState.current !== answers.state || storedSelector.current !== stateSelector) {
      return stateSelector(answers.state);
    }
    return storedSelectedState.current;
  })();

  const [, triggerRender] = useState<T>(storedSelectedState.current);
  useLayoutEffect(() => {
    storedSelector.current = stateSelector;
    storedStoreState.current = answers.state;
    storedSelectedState.current = selectedStateToReturn;
  });

  useLayoutEffect(() => {
    let unsubscribed = false;
    const unsubscribe = answers.addListener({
      valueAccessor: state => state,
      callback: (state: State) => {
        // prevent React state update on an unmounted component
        if (unsubscribed) {
          return;
        }
        const currentSelectedState = storedSelector.current(state);
        if (storedSelectedState.current !== currentSelectedState) {
          storedSelectedState.current = currentSelectedState;
          triggerRender(currentSelectedState);
        }
      }
    });
    return () => {
      unsubscribed = true;
      unsubscribe();
    };
  }, [answers]);

  return selectedStateToReturn;
}
