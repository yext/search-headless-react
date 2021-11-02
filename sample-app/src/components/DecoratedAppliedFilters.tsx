import AppliedFilters from "./AppliedFilters";
import { AppliedQueryFilter } from "@yext/answers-core";
import { useAnswersState } from '@yext/answers-headless-react';
import { GroupedFilters } from '../models/groupedFilters';
import { getGroupedAppliedFilters } from '../utils/appliedfilterutils';
import { StaticFiltersLabelConfig } from "./StaticFilters";

export interface DecoratedAppliedFiltersConfig {
  showFieldNames?: boolean,
  hiddenFields?: Array<string>,
  labelText?: string,
  delimiter?: string,
  staticFiltersGroupLabels?: Record<string, StaticFiltersLabelConfig>,
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
