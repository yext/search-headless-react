import { AnswersHeadless } from '@yext/answers-headless';
import { useContext } from 'react';
import { SearchHeadlessContext } from './SearchHeadlessContext';

export type SearchUtilities = AnswersHeadless['utilities'];

export function useSearchUtilities(): SearchUtilities {
  return useContext(SearchHeadlessContext).utilities;
}