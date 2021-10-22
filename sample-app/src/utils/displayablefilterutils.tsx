import { AppliedQueryFilter, Filter, DisplayableFacet } from '@yext/answers-core';
import { DisplayableFilter } from '../models/displayableFilter';
import { getFilterDisplayValue } from './filterutils';

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