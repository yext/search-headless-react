import { AppliedQueryFilter, CombinedFilter, Filter, DisplayableFacet, NearFilterValue } from '@yext/answers-core';
import { FiltersState } from '@yext/answers-headless/lib/esm/models/slices/filters';
import { mapArrayToObject } from '../utils/arrayutils';
import { GroupedFilters } from '../models/groupedFilters';
import { DisplayableAppliedFilter } from '../models/displayableFilter';

/**
 * Check if the object follows CombinedFilter interface
 */
function isCombinedFilter(obj: Filter | CombinedFilter): obj is CombinedFilter {
  return 'filters' in obj && 'combinator' in obj;
}

/**
 * Check if the object follows NearFilterValue interface
 */
function isNearFilterValue(obj: Object): obj is NearFilterValue {
  return 'radius' in obj && 'lat' in obj && 'long' in obj;
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
function pruneNlpFilters (
  nlpFilters: DisplayableAppliedFilter[], 
  appliedFilters: DisplayableAppliedFilter[], 
  hiddenFields: string[]
): DisplayableAppliedFilter[] {
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
  appliedFilters: DisplayableAppliedFilter[], hiddenFields: string[]): DisplayableAppliedFilter[] {
  return appliedFilters.filter(appliedFilter => {
    return !hiddenFields.includes(appliedFilter.filter.fieldId);
  });
}

/**
 * Combine all of the applied filters into a list of GroupedFilters where each contains a label and 
 * list of filters under that same label or category.
 */
function createGroupedFilters(
  appliedFilters: DisplayableAppliedFilter[],
  nlpFilters: DisplayableAppliedFilter[]
): Array<GroupedFilters> {
  const getGroupLabel = (filter: DisplayableAppliedFilter) => filter.groupLabel;
  const allFilters = appliedFilters.concat(nlpFilters);
  const groupedFilters: Record<string, DisplayableAppliedFilter[]> = mapArrayToObject(allFilters, getGroupLabel);
  return Object.keys(groupedFilters).map(label => ({
    label: label,
    filters: groupedFilters[label]
  }));
}

/**
 * get a filter's display value or label in string format
 */
function getFilterDisplayValue(filter: Filter): string {
  const value = filter.value;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value.toString();
  }
  if (isNearFilterValue(value)) {
    return `within ${value.radius}m radius`;
  }
  throw Error('unrecognized filter value type');
}

/**
 * convert a list of facets to DisplayableAppliedFilter format with only selected facets returned.
 */
function getDisplayableAppliedFacets(facets: DisplayableFacet[] | undefined) {
  let appliedFacets: DisplayableAppliedFilter[] = [];
  facets?.forEach(facet => {
    facet.options.forEach(option => {
      if(option.selected) {
        appliedFacets.push({
          filterType: 'FACET',
          filter: {
            fieldId: facet.fieldId,
            matcher: option.matcher,
            value: option.value
          },
          groupLabel: facet.displayName,
          label: option.displayName
        });
      }
    });
  });
  return appliedFacets;
}

/**
 * convert a list of static filters to DisplayableAppliedFilter format.
 */
function getDisplayableStaticFilters(filters: Filter[]) {
  let appliedStaticFilters: DisplayableAppliedFilter[] = [];
  filters?.forEach(filter => {
    appliedStaticFilters.push({
      filterType: 'STATIC_FILTER',
      filter: filter,
      groupLabel: filter.fieldId,
      label: getFilterDisplayValue(filter),
    });
  });
  return appliedStaticFilters;
}

/**
 * convert a list of nlp filters to DisplayableAppliedFilter format.
 */
function getDisplayableNlpFilters(filters: AppliedQueryFilter[]) {
  let appliedNplFilters: DisplayableAppliedFilter[] = [];
  filters?.forEach(filter => {
    appliedNplFilters.push({
      filterType: 'NLP_FILTER',
      filter: filter.filter,
      groupLabel: filter.displayKey,
      label: filter.displayValue,
    });
  });
  return appliedNplFilters;
}

/**
 * Process all applied filter types (facets, static filters, and nlp filters) by removing 
 * duplicates and specified hidden fields, and grouped the applied filters into categories.
 */
export function getGroupedAppliedFilters(
  appliedFiltersState: FiltersState,
  nlpFilters: AppliedQueryFilter[],
  hiddenFields: string[]
) {
  const displayableStaticFilters = getDisplayableStaticFilters(flattenFilters(appliedFiltersState?.static));
  const displayableFacets = getDisplayableAppliedFacets(appliedFiltersState?.facets);
  const displayableNlpFilters = getDisplayableNlpFilters(nlpFilters);
  
  const appliedFilters = displayableStaticFilters.concat(displayableFacets);
  const prunedAppliedFilters = pruneAppliedFilters(appliedFilters, hiddenFields);
  const prunedNlpFilters = pruneNlpFilters (displayableNlpFilters, prunedAppliedFilters, hiddenFields);

  return createGroupedFilters(appliedFilters, prunedNlpFilters);
}
