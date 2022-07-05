import { useSearchActions, SearchActions } from './useSearchActions';
import { useSearchState, StateSelector } from './useSearchState';
import { useSearchUtilities, SearchUtilities } from './useSearchUtilities';
import { subscribeToStateUpdates } from './subscribeToStateUpdates';
import { SearchHeadlessProvider } from './SearchHeadlessProvider';
import { SearchHeadlessContext } from './SearchHeadlessContext';

export * from '@yext/answers-headless';
export {
  SearchHeadlessContext,
  subscribeToStateUpdates,
  useSearchActions,
  useSearchState,
  useSearchUtilities,
  SearchHeadlessProvider,
  SearchActions,
  SearchUtilities,
  StateSelector
};

/**
 * @deprecated Answers components should be replaced with their Search counterparts
 */
export {
  useSearchActions as useAnswersActions,
  SearchActions as AnswersActions,
  useSearchState as useAnswersState,
  useSearchUtilities as useAnswersUtilities,
  SearchUtilities as AnswersUtilities,
  SearchHeadlessProvider as AnswersHeadlessProvider,
  SearchHeadlessContext as AnswersHeadlessContext
};