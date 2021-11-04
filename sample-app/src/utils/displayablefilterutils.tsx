import { AppliedQueryFilter, DisplayableFacet } from '@yext/answers-core';
import { SelectableFilter } from '@yext/answers-headless/lib/commonjs/models/utils/selectablefilter';
import { DisplayableFilter } from '../models/displayableFilter';
import { getFilterDisplayValue } from './filterutils';

/**
 * Convert a list of facets to DisplayableFilter format with only selected facets returned.
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
 * Convert a map of static filters to DisplayableFilter format with only selected filters returned.
 */
export function getDisplayableStaticFilters(
  staticFilters: Record<string, SelectableFilter[] | null> | null | undefined,
  groupLabels: Record<string, string>
): DisplayableFilter[] {
  let appliedStaticFilters: DisplayableFilter[] = [];
  staticFilters && Object.entries(staticFilters).forEach(([filterCollectionId, filterSet]) => 
    filterSet?.forEach(filter => {
      if (filter.selected) {
        appliedStaticFilters.push({
          filterType: 'STATIC_FILTER',
          filter: filter.filter,
          groupLabel: groupLabels?.[filter.filter.fieldId] || filter.filter.fieldId,
          label: getFilterDisplayValue(filter.filter),
          filterCollectionId: filterCollectionId
        });
      }
    })
  );
  return appliedStaticFilters;
}

/**
 * Convert a list of nlp filters to DisplayableFilter format.
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