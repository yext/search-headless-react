import { useContext, useLayoutEffect, useRef, useState} from 'react';
import { State } from '@yext/answers-headless/lib/esm/models/state';
import { AnswersActionsContext } from './AnswersActionsContext';

export type StateSelector<T> = (s: State) => T;

/**
 * Returns the Answers State returned by the map function.
 * Very similar to useSelector in react-redux.
 */
export function useAnswersState<T>(stateSelector: StateSelector<T>): T {
  const statefulCore = useContext(AnswersActionsContext);

  const latestStoreState = useRef<State>(statefulCore.state);
  const latestSelector = useRef<StateSelector<T>>(stateSelector);
  const latestSelectedState = useRef<T>(stateSelector(statefulCore.state));
  const selectedState = getSelectedState();

  function getSelectedState() {
    if (latestStoreState.current !== statefulCore.state || latestSelector.current !== stateSelector) {
      return stateSelector(statefulCore.state);
    }
    return latestSelectedState.current;
  }

  const [, triggerRender] = useState<T>();
  useLayoutEffect(() => {
    latestSelector.current = stateSelector;
    latestStoreState.current = statefulCore.state;
    latestSelectedState.current = selectedState;
  });

  useLayoutEffect(() => {
    return statefulCore.addListener({
      valueAccessor: latestSelector.current,
      callback: (selectedState: T) => {
        if (latestSelectedState.current !== selectedState) {
          latestSelectedState.current = selectedState;
          triggerRender(selectedState);
        }
      }
    });
  }, [statefulCore]);

  return selectedState;
}
