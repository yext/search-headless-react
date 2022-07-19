import { useSearchActions, SearchActions } from './useSearchActions';
import { StateSelector, useSearchState } from './useSearchState';
import { useSearchUtilities, SearchUtilities } from './useSearchUtilities';
import { SearchHeadlessProvider } from './SearchHeadlessProvider';
import { SearchHeadlessContext } from './SearchHeadlessContext';
import { PropsWithChildren } from 'react';
import { HeadlessConfig } from '@yext/search-headless';

type Props = HeadlessConfig & {
  verticalKey?: string,
  sessionTrackingEnabled?: boolean
};

/**
 * @deprecated AnswersHeadlessContext has been deprecated and replaced by SearchHeadlessContext
 */
export const AnswersHeadlessContext = SearchHeadlessContext;

/**
 * @deprecated AnswersActions has been deprecated and replaced by SearchActions
 */
export type AnswersActions = SearchActions;

/**
 * @deprecated AnswersUtilities has been deprecated and replaced by SearchUtilities
 */
export type AnswersUtilities = SearchUtilities;

/**
 * @deprecated useAnswersActions has been deprecated and replaced by useSearchActions
 */
export function useAnswersActions(): SearchActions { return useSearchActions(); }

/**
 * @deprecated useAnswersState has been deprecated and replaced by useSearchState
 */
export function useAnswersState<T>(stateSelector: StateSelector<T>): T {
  return useSearchState(stateSelector);
}

/**
 * @deprecated useAnswersUtilities has been deprecated and replaced by useSearchUtilities
 */
export function useAnswersUtilities(): SearchUtilities { return useSearchUtilities(); }

/**
 * @deprecated AnswersHeadlessProvider has been deprecated and replaced by SearchHeadlessProvider
 */
export function AnswersHeadlessProvider(props: PropsWithChildren<Props>): JSX.Element {
  return SearchHeadlessProvider(props);
}