import { AppliedQueryFilter, CombinedFilter, Filter, DisplayableFacet, NearFilterValue } from '@yext/answers-core';
import { FiltersState } from '@yext/answers-headless/lib/esm/models/slices/filters';
import { mapArrayToObject } from '../utils/arrayutils';
import { GroupedFilters } from '../models/groupedFilters';
import { DisplayableFilter } from '../models/displayableFilter';

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
 * Returns true if the two given DisplayableFilters are the same
 */
export function isDuplicateFilter(thisFilter: DisplayableFilter, otherFilter: DisplayableFilter): boolean {
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
function pruneNlpFilters (nlpFilters: DisplayableFilter[], appliedFilters: DisplayableFilter[], 
  hiddenFields: string[]): DisplayableFilter[] {
  const duplicatesRemoved = nlpFilters.filter(nlpFilter => {
    const isDuplicate = appliedFilters.find(appliedFilter =>
      isDuplicateFilter(nlpFilter, appliedFilter)
    );
    return !isDuplicate;
  });
  return pruneAppliedFilters(duplicatesRemoved, hiddenFields);
}

/**
 * Returns a new list of applied filters with filter on hiddenFields removed 
 * from the given applied filter list.
 */
function pruneAppliedFilters(appliedFilters: DisplayableFilter[], hiddenFields: string[]): DisplayableFilter[] {
  return appliedFilters.filter(filter => {
    return !hiddenFields.includes(filter.fieldId);
  });
}

/**
 * Combine all of the applied filters into a list of GroupedFilters where each contains a label and 
 * list of filters under that same label or category.
 */
function createGroupedFilters(appliedFilters: DisplayableFilter[], nlpFilters: DisplayableFilter[]): Array<GroupedFilters> {
  const getGroupLabel = (filter: DisplayableFilter) => filter.groupLabel;
  const allFilters = appliedFilters.concat(nlpFilters);
  const groupedFilters: Record<string, DisplayableFilter[]> = mapArrayToObject(allFilters, getGroupLabel);
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
 * convert a list of facets to DisplayableFilter format with only selected facets returned.
 */
function getDisplayableAppliedFacets(facets: DisplayableFacet[] | undefined) {
  let appliedFacets: DisplayableFilter[] = [];
  facets?.forEach(facet => {
    facet.options.forEach(option => {
      if(option.selected) {
        appliedFacets.push({
          filterType: 'FACET',
          fieldId: facet.fieldId,
          matcher: option.matcher,
          value: option.value,
          groupLabel: facet.displayName,
          label: option.displayName,
          count: option.count
        });
      }
    });
  });
  return appliedFacets;
}

/**
 * convert a list of static filters to DisplayableFilter format.
 */
function getDisplayableStaticFilters(filters: Filter[]) {
  let appliedStaticFilters: DisplayableFilter[] = [];
  filters?.forEach(filter => {
    appliedStaticFilters.push({
      filterType: 'STATIC_FILTER',
      fieldId: filter.fieldId,
      matcher: filter.matcher,
      value: filter.value,
      groupLabel: filter.fieldId,
      label: getFilterDisplayValue(filter),
    });
  });
  return appliedStaticFilters;
}

/**
 * convert a list of nlp filters to DisplayableFilter format.
 */
function getDisplayableNlpFilters(filters: AppliedQueryFilter[]) {
  let appliedNplFilters: DisplayableFilter[] = [];
  filters?.forEach(filter => {
    appliedNplFilters.push({
      filterType: 'NLP_FILTER',
      fieldId: filter.filter.fieldId,
      matcher: filter.filter.matcher,
      value: filter.filter.value,
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
export function getGroupedAppliedFilters(appliedFiltersState: FiltersState, nlpFilters: AppliedQueryFilter[], hiddenFields: string[]) {
  const displayableStaticFilters = getDisplayableStaticFilters(flattenFilters(appliedFiltersState?.static));
  const displayableFacets = getDisplayableAppliedFacets(appliedFiltersState?.facets);
  const displayableNlpFilters = getDisplayableNlpFilters(nlpFilters);
  
  const appliedFilters = displayableStaticFilters.concat(displayableFacets);
  const prunedAppliedFilters = pruneAppliedFilters(appliedFilters, hiddenFields);
  const prunedNlpFilters = pruneNlpFilters (displayableNlpFilters, prunedAppliedFilters, hiddenFields);

  return createGroupedFilters(appliedFilters, prunedNlpFilters);

}
