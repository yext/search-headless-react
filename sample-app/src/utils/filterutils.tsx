import {CombinedFilter, Filter } from '@yext/answers-core';


/**
 * Check if the object follows CombinedFilter interface
 * @param obj 
 * @returns {boolean}
 */
export function isCombinedFilter(obj: any): obj is CombinedFilter {
  return 'filters' in obj && 'combinator' in obj;
}

/**
 * flatten the given filter, such as if the given filter is of type CombinedFilter 
 * with possible nested layers of Filter objects, into a 1-dimension array of Filter objects
 */
export function flattenFilterNodes(filter: Filter | CombinedFilter | null | undefined, filterNodes: Array<Filter>): Array<Filter> {
  if(filter) {
    if(isCombinedFilter(filter)) {
      filter.filters.forEach(fltr => flattenFilterNodes(fltr, filterNodes));
    } else {
      filterNodes.push(filter);
    }
  }
  return filterNodes;
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