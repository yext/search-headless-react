import { useSearchActions, SearchActions } from './useSearchActions';
import { useSearchState } from './useSearchState';
import { useSearchUtilities, SearchUtilities } from './useSearchUtilities';
import { SearchHeadlessProvider } from './SearchHeadlessProvider';
import { SearchHeadlessContext } from './SearchHeadlessContext';

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
export const useAnswersActions = useSearchActions;

/**
 * @deprecated useAnswersState has been deprecated and replaced by useSearchState
 */
export const useAnswersState = useSearchState;

/**
 * @deprecated useAnswersUtilities has been deprecated and repalced by useSearchUtilities
 */
export const useAnswersUtilities = useSearchUtilities;

/**
 * @deprecated AnswersHeadlessProvider has been deprecated and replaced by SearfchHeadlessProvider
 */
export const AnswersHeadlessProvider = SearchHeadlessProvider;