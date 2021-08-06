import { useEffect, useState} from 'react';
import { State } from '@yext/answers-headless/lib/esm/models/state';
import { useAnswersActions } from './useAnswersActions';

const initialState: State = {
  query: {},
  universal: {},
  vertical: {},
  filters: {},
};

type MapState<T> = (s: State) => T;

/**
 * Returns the Answers State returned by the map function
 */
export function useAnswersState<T>(mapState: MapState<T>): T {
  const [answersState, setState] = useState(initialState);
  const answersActions = useAnswersActions();

  useEffect(() => {
    return answersActions.addListener({
      valueAccessor: (state: State) => state,
      callback: (state: State) => setState(state)
    });
  });

  return mapState(answersState);
}