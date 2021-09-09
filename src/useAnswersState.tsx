import { useContext, useEffect, useState} from 'react';
import { State } from '@yext/answers-headless/lib/esm/models/state';
import { useAnswersActions } from './useAnswersActions';
import { AnswersActionsContext } from '.';

export type StateMapper<T> = (s: State) => T;

/**
 * Returns the Answers State returned by the map function
 */
export function useAnswersState<T>(mapState: StateMapper<T>): T | undefined {
  const statefulCore = useContext(AnswersActionsContext);
  const [stateValue, setState] = useState(mapState(statefulCore.state));
  const answersActions = useAnswersActions();

  useEffect(() => {
    return answersActions.addListener({
      valueAccessor: mapState,
      callback: (stateValue: T) => {
        setState(stateValue);
      }
    });
  });

  return stateValue;
}