import { AppliedQueryFilter, CombinedFilter, Filter } from '@yext/answers-core';
import { FiltersState } from '@yext/answers-headless/lib/esm/models/slices/filters';
import { groupArray } from '../utils/arrayutils';
import { GroupedFilters } from '../models/groupedFilters';

/**
 * Check if the object follows CombinedFilter interface
 * @param obj
 */
export function isCombinedFilter(obj: any): obj is CombinedFilter {
  return 'filters' in obj && 'combinator' in obj;
}

/**
 * Flatten the given filter, such as if the given filter is of type CombinedFilter 
 * with possible nested layers of Filter objects, into a 1-dimension array of Filter objects
 */
export function flattenFilters(filter: Filter | CombinedFilter | null | undefined): Array<Filter> {
  let filters: Array<Filter> = [];
  if(!filter) {
    return filters;
  }
  if(isCombinedFilter(filter)) {
    filter.filters.forEach(fltr => filters = filters.concat(flattenFilters(fltr)));
  } else {
    filters.push(filter);
  }
  return filters;
}

/**
 * Returns true if the two given filters are the same
 */
export function isDuplicateFilter(thisFilter: Filter, otherFilter: Filter): boolean {
  if (thisFilter.fieldId !== otherFilter.fieldId) {
    return false;
  }
  if (thisFilter.matcher !== otherFilter.matcher) {
    return false;
  }
  if (thisFilter.value !== otherFilter.value) {
    return false;
  }
  return true;
}

/**
 * Returns a new list of nlp filters with duplicates of other filters and 
 * filter listed in hiddenFields removed from the given nlp filter list.
 */
export function pruneNlpFilters (nlpFilters: AppliedQueryFilter[], appliedFilters: Filter[], 
  hiddenFields: string[]): AppliedQueryFilter[] {
  const duplicatesRemoved = nlpFilters.filter(nlpFilter => {
    const isDuplicate = appliedFilters.find(appliedFilter =>
      isDuplicateFilter(nlpFilter.filter, appliedFilter)
    );
    return !isDuplicate;
  });
  return duplicatesRemoved.filter(nlpFilter => {
    return !hiddenFields.includes(nlpFilter.filter.fieldId);
  });
}

/**
 * Returns a new list of applied filters with filter on hiddenFields removed 
 * from the given nlp filter list.
 */
export function pruneAppliedFilters(appliedFilters: Filter[], hiddenFields: string[]): Filter[] {
  return appliedFilters.filter(filter => {
    return !hiddenFields.includes(filter.fieldId);
  });
}

/**
 * Combine all of the applied filters into a list of GroupedFilters where each contains a label and 
 * list of filters under that same label or category. All filters will convert to DisplayableFilter format
 * where displayValue will be used in the JSX element construction.
 */
export function createGroupedFilters(nlpFilters: AppliedQueryFilter[], appliedFilters: Filter[]): Array<GroupedFilters> {
  const getFieldName = (filter: Filter) => filter.fieldId;
  const getNlpFieldName = (filter: AppliedQueryFilter) => filter.displayKey;
  const getDisplayableAppliedFilter = (filter: Filter) => ({
    filter: filter,
    filterGroupLabel: filter.fieldId,
    filterLabel: filter.value
  });
  const getDisplayableNlpFilter = (filter: AppliedQueryFilter, index: number) => ({
    filter: filter.filter,
    filterGroupLabel: filter.displayKey,
    filterLabel: filter.displayValue
  });
  
  let groupedFilters = groupArray(appliedFilters, getFieldName, getDisplayableAppliedFilter);
  groupedFilters = groupArray(nlpFilters, getNlpFieldName, getDisplayableNlpFilter, groupedFilters);
  return Object.keys(groupedFilters).map(label => ({
    label: label,
    filters: groupedFilters[label]
  }));
}

/**
 * Restructure and combine static filters from given FiltersState into a list of Filter objects
 */
export function getAppliedFilters(appliedFiltersState: FiltersState | undefined): Array<Filter> {
  const appliedStaticFilters = flattenFilters(appliedFiltersState?.static);
  return appliedStaticFilters;
}