import AppliedFilters from "./AppliedFilters";
import { useAnswersState, AppliedQueryFilter } from '@yext/answers-headless-react';
import { GroupedFilters } from '../models/groupedFilters';
import { getGroupedAppliedFilters } from '../utils/appliedfilterutils';

export interface DecoratedAppliedFiltersConfig {
  showFieldNames?: boolean,
  hiddenFields?: Array<string>,
  labelText?: string,
  delimiter?: string,
  /**
   * A mapping of static filter fieldIds to their displayed group labels.
   */
  staticFiltersGroupLabels?: Record<string, string>,
  appliedQueryFilters?: AppliedQueryFilter[]
}

/**
 * Container component for AppliedFilters
 */
export function DecoratedAppliedFiltersDisplay(props : DecoratedAppliedFiltersConfig): JSX.Element {
  const { hiddenFields = [], staticFiltersGroupLabels = {}, appliedQueryFilters = [], ...otherProps } = props;
  const state = useAnswersState(state => state);
  const filterState = state.vertical.results ? state.filters : {};
  const groupedFilters: Array<GroupedFilters> = getGroupedAppliedFilters(filterState, appliedQueryFilters, hiddenFields, staticFiltersGroupLabels);
  return <AppliedFilters appliedFilters={groupedFilters} {...otherProps}/>
}

export default function DecoratedAppliedFilters(
  props : Omit<DecoratedAppliedFiltersConfig, 'appliedQueryFilters'>
): JSX.Element {
  const nlpFilters = useAnswersState(state => state.vertical?.results?.verticalResults.appliedQueryFilters) || [];  
  return <DecoratedAppliedFiltersDisplay appliedQueryFilters={nlpFilters} {...props}/>
};
