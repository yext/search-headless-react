import { SearchHeadless } from '@yext/search-headless';
import { useContext } from 'react';
import { SearchHeadlessContext } from './SearchHeadlessContext';

export type SearchUtilities = SearchHeadless['utilities'];

export function useSearchUtilities(): SearchUtilities {
  return useContext(SearchHeadlessContext).utilities;
}