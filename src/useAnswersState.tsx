import { useCallback, useContext, useEffect, useRef } from 'react';
import { State } from '@yext/answers-headless';
import { AnswersHeadlessContext } from './AnswersHeadlessContext';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector';

export type StateSelector<T> = (s: State) => T;

/**
 * Returns the Answers State returned by the map function.
 * Uses "use-sync-external-store/shim" to handle reading
 * and subscribing from external store in React version
 * pre-18 and 18.
 */
export function useAnswersState<T>(stateSelector: StateSelector<T>): T {
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

  const selectedState = useSyncExternalStoreWithSelector<State, T>(
    subscribe,
    getSnapshot,
    getSnapshot,
    stateSelector
  );
  return selectedState;
}
