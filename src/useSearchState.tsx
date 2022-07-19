import { useCallback, useContext, useEffect, useRef } from 'react';
import { State } from '@yext/search-headless';
import { SearchHeadlessContext } from './SearchHeadlessContext';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector';

export type StateSelector<T> = (s: State) => T;

/**
 * Returns the Search State returned by the map function.
 * Uses "use-sync-external-store/shim" to handle reading
 * and subscribing from external store in React version
 * pre-18 and 18.
 */
export function useSearchState<T>(stateSelector: StateSelector<T>): T {
  const search = useContext(SearchHeadlessContext);
  if (search.state === undefined) {
    throw new Error('Attempted to call useSearchState() outside of SearchHeadlessProvider.'
     + ' Please ensure that \'useSearchState()\' is called within an SearchHeadlessProvider component.');
  }

  const getSnapshot = useCallback(() => search.state, [search.state]);
  const isMountedRef = useRef<boolean>(false);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const subscribe = useCallback(cb =>
    search.addListener({
      valueAccessor: state => state,
      callback: () => {
        // prevent React state update on an unmounted component
        if (!isMountedRef.current) {
          return;
        }
        cb();
      }
    }), [search]);

  const selectedState = useSyncExternalStoreWithSelector<State, T>(
    subscribe,
    getSnapshot,
    getSnapshot,
    stateSelector
  );
  return selectedState;
}