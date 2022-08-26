import { SearchHeadless } from '@yext/search-headless';
import { useContext } from 'react';
import { SearchHeadlessContext } from './SearchHeadlessContext';

export type SearchActions = SearchHeadless;

export function useSearchActions(): SearchActions {
  const searchHeadless = useContext(SearchHeadlessContext);
  if (searchHeadless.state === undefined) {
    throw new Error('Attempted to call useSearchActions() outside of a SearchHeadlessContext.'
     + ' Please ensure that \'useSearchActions()\' is called within the scope of a SearchHeadlessContext.');
  }
  return searchHeadless;
}