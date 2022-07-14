import { AnswersHeadless } from '@yext/answers-headless';
import { useContext } from 'react';
import { SearchHeadlessContext } from './SearchHeadlessContext';

export type SearchActions = AnswersHeadless;

export function useSearchActions(): SearchActions {
  const answersHeadless = useContext(SearchHeadlessContext);
  if (answersHeadless.state === undefined) {
    throw new Error('Attempted to call useSearchActions() outside of SearchHeadlessProvider.'
     + ' Please ensure that \'useSearchActions()\' is called within an SearchHeadlessProvider component.');
  }
  return answersHeadless;
}