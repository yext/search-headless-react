import { useContext, useLayoutEffect, useRef, useState } from 'react';
import { State } from '@yext/answers-headless/lib/esm/models/state';
import { AnswersHeadlessContext } from './AnswersHeadlessContext';

export type StateSelector<T> = (s: State) => T;

/**
 * Returns the Answers State returned by the map function.
 * Very similar to useSelector in react-redux.
 */
export function useAnswersState<T>(stateSelector: StateSelector<T>): T {
  const answers = useContext(AnswersHeadlessContext);
  if (answers.state === undefined) {
    throw new Error('Attempted to use AnswersHeadless before it\'s initialized.'
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
