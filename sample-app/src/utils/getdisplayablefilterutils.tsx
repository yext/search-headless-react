import { AppliedQueryFilter, Filter, DisplayableFacet, NearFilterValue } from '@yext/answers-core';
import { DisplayableFilter } from '../models/displayableFilter';

/**
 * Check if the object follows NearFilterValue interface
 */
function isNearFilterValue(obj: Object): obj is NearFilterValue {
  return 'radius' in obj && 'lat' in obj && 'long' in obj;
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
export function getDisplayableAppliedFacets(facets: DisplayableFacet[] | undefined): DisplayableFilter[] {
  let appliedFacets: DisplayableFilter[] = [];
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
 * convert a list of static filters to DisplayableFilter format.
 */
export function getDisplayableStaticFilters(filters: Filter[]): DisplayableFilter[] {
  let appliedStaticFilters: DisplayableFilter[] = [];
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
 * convert a list of nlp filters to DisplayableFilter format.
 */
export function getDisplayableNlpFilters(filters: AppliedQueryFilter[]): DisplayableFilter[] {
  let appliedNlpFilters: DisplayableFilter[] = [];
  filters?.forEach(filter => {
    appliedNlpFilters.push({
      filterType: 'NLP_FILTER',
      filter: filter.filter,
      groupLabel: filter.displayKey,
      label: filter.displayValue,
    });
  });
  return appliedNlpFilters;
}