import {CombinedFilter, Filter } from '@yext/answers-core';


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