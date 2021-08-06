import { useEffect, useState} from 'react';
import { State } from '@yext/answers-headless/lib/esm/models/state';
import { useAnswersActions } from './useAnswersActions';

const initialState: State = {
  query: {},
  universal: {},
  vertical: {},
  filters: {},
};

/**
 * The type of a function which returns part of the state
 */
type StateSlicer<T> = (s: State) => T;

/**
 * Returns the entire answes state, or a part of it if a state slicer is supplied
 */
export function useAnswersState<T>(stateSlicer?: StateSlicer<T>): State | T {
  const [answersState, setState] = useState(initialState);
  const answersActions = useAnswersActions();

  useEffect(() => {
    return answersActions.addListener({
      valueAccessor: (state: State) => state,
      callback: (state: State) => setState(state)
    });
  });

  return stateSlicer ? stateSlicer(answersState) : answersState;
}