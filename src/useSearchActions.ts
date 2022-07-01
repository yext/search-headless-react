import { AnswersHeadless } from '@yext/answers-headless';
import { useContext } from 'react';
import { SearchHeadlessContext } from './SearchHeadlessContext';

export type SearchActions = AnswersHeadless;

export function useSearchActions(): SearchActions {
  const answersHeadless = useContext(SearchHeadlessContext);
  if (answersHeadless.state === undefined) {
    throw new Error('Attempted to call useAnswersActions() outside of SearchHeadlessProvider.'
     + ' Please ensure that \'useAnswersActions()\' is called within an SearchHeadlessProvider component.');
  }
  return answersHeadless;
}

export type AnswersActions = SearchActions;
export function useAnswersActions(): AnswersActions {
  return useSearchActions();
}