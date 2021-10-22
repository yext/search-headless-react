import { AppliedQueryFilter, CombinedFilter, Filter } from '@yext/answers-core';
import { FiltersState } from '@yext/answers-headless/lib/esm/models/slices/filters';
import { mapArrayToObject } from './arrayutils';
import { GroupedFilters } from '../models/groupedFilters';
import { DisplayableFilter } from '../models/displayableFilter';
import {
  getDisplayableAppliedFacets,
  getDisplayableStaticFilters,
  getDisplayableNlpFilters
} from './createdisplayablefilter';

/**
 * Check if the object follows CombinedFilter interface
 */
function isCombinedFilter(obj: Filter | CombinedFilter): obj is CombinedFilter {
  return 'filters' in obj && 'combinator' in obj;
}

/**
 * Flatten the given filter, such as if the given filter is of type CombinedFilter 
 * with possible nested layers of Filter objects, into a 1-dimension array of Filter objects
 */
function flattenFilters(filter: Filter | CombinedFilter | null | undefined): Array<Filter> {
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
function isDuplicateFilter(thisFilter: Filter, otherFilter: Filter): boolean {
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
function pruneNlpFilters (
  nlpFilters: DisplayableFilter[], 
  appliedFilters: DisplayableFilter[], 
  hiddenFields: string[]
): DisplayableFilter[] {
  const duplicatesRemoved = nlpFilters.filter(nlpFilter => {
    const isDuplicate = appliedFilters.find(appliedFilter =>
      isDuplicateFilter(nlpFilter.filter, appliedFilter.filter)
    );
    return !isDuplicate;
  });
  return pruneAppliedFilters(duplicatesRemoved, hiddenFields);
}

/**
 * Returns a new list of applied filters with filter on hiddenFields removed 
 * from the given applied filter list.
 */
function pruneAppliedFilters(
  appliedFilters: DisplayableFilter[], hiddenFields: string[]): DisplayableFilter[] {
  return appliedFilters.filter(appliedFilter => {
    return !hiddenFields.includes(appliedFilter.filter.fieldId);
  });
}

/**
 * Combine all of the applied filters into a list of GroupedFilters where each contains a label and 
 * list of filters under that same label or category.
 */
function createGroupedFilters(
  appliedFilters: DisplayableFilter[],
  nlpFilters: DisplayableFilter[]
): Array<GroupedFilters> {
  const getGroupLabel = (filter: DisplayableFilter) => filter.groupLabel;
  const allFilters = [...appliedFilters, ...nlpFilters];
  const groupedFilters: Record<string, DisplayableFilter[]> = mapArrayToObject(allFilters, getGroupLabel);
  return Object.keys(groupedFilters).map(label => ({
    label: label,
    filters: groupedFilters[label]
  }));
}

/**
 * Process all applied filter types (facets, static filters, and nlp filters) by removing 
 * duplicates and specified hidden fields, and grouped the applied filters into categories.
 */
export function getGroupedAppliedFilters(
  appliedFiltersState: FiltersState,
  nlpFilters: AppliedQueryFilter[],
  hiddenFields: string[]
): Array<GroupedFilters>  {
  const displayableStaticFilters = getDisplayableStaticFilters(flattenFilters(appliedFiltersState?.static));
  const displayableFacets = getDisplayableAppliedFacets(appliedFiltersState?.facets);
  const displayableNlpFilters = getDisplayableNlpFilters(nlpFilters);
  
  const appliedFilters = [...displayableStaticFilters, ...displayableFacets];
  const prunedAppliedFilters = pruneAppliedFilters(appliedFilters, hiddenFields);
  const prunedNlpFilters = pruneNlpFilters (displayableNlpFilters, prunedAppliedFilters, hiddenFields);

  return createGroupedFilters(appliedFilters, prunedNlpFilters);
}
