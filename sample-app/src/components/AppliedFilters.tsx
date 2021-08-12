import { AppliedQueryFilter, Filter } from '@yext/answers-core';
import { useAnswersState } from '@yext/answers-headless-react';
import { FiltersState } from '@yext/answers-headless/lib/esm/models/slices/filters';
import { groupArray } from '../utils/arrayutils';
import { flattenFilters, isDuplicateFilter } from '../utils/filterutils';
import { DisplayableFilter } from '../models/displayableFilter';
import { GroupedFilters } from '../models/groupedFilters';
import '../sass/AppliedFilters.scss';

interface Props {
  showFieldNames?: boolean,
  hiddenFields?: Array<string>,
  labelText?: string,
  delimiter?: string
}

/**
 * Returns a new list of nlp filter nodes with duplicates of other filter nodes and 
 * filter on hiddenFields removed from the given nlp filter list.
 */
function pruneNlpFilters (nlpFilters: AppliedQueryFilter[], appliedFilters: Filter[], 
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
 * Returns a new list of applied filter nodes with filter on hiddenFields removed 
 * from the given nlp filter list.
 */
function pruneAppliedFilters(appliedFilters: Filter[], hiddenFields: string[]): Filter[] {
  return appliedFilters.filter(filter => {
    return !hiddenFields.includes(filter.fieldId);
  });
}

/**
 * Combine all of the applied filters into a list of GroupedFilters where each contains a label and 
 * list of filters under that same label or category. All filters will convert to DisplayableFilter format
 * where displayValue will be used in the JSX element construction.
 */
function createGroupedFilters(nlpFilters: AppliedQueryFilter[], appliedFilters: Filter[]): Array<GroupedFilters> {
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
 * Restructure and combine all static filters and facets from given
 * FiltersState into a list of Filter objects
 */
function getAppliedFilters(appliedFiltersState: FiltersState | undefined): Array<Filter> {
  const appliedStaticFilters = flattenFilters(appliedFiltersState?.static);
  const appliedFacets = appliedFiltersState?.facets || [];
  
  let appliedFacetFilters: Filter[] = [];
  appliedFacets.forEach((facet) => {
    facet.options.forEach((option) => {
      const filter = {
        fieldId: facet.fieldId,
        matcher: option.matcher,
        value: option.value
      };
      appliedFacetFilters.push(filter);
    });
  });
  return [...appliedStaticFilters, ...appliedFacetFilters];
}


/**
 * Renders AppliedFilters component
 */
export default function AppliedFilters({showFieldNames, hiddenFields = [], labelText, delimiter}: Props): JSX.Element {

  let appliedFilters = getAppliedFilters(useAnswersState(state => state.filters));
  appliedFilters = pruneAppliedFilters(appliedFilters, hiddenFields);

  let nlpFilters = useAnswersState(state => state.vertical.results?.verticalResults.appliedQueryFilters) || [];
  nlpFilters = pruneNlpFilters(nlpFilters, appliedFilters, hiddenFields);

  const appliedFiltersArray: Array<GroupedFilters> = createGroupedFilters(nlpFilters, appliedFilters);

  return (
    <div className="AppliedFilters" aria-label={labelText}>
      {appliedFiltersArray.map((filterGroup: GroupedFilters, index: number) => {
        return (
          <div className="AppliedFilters__filterGroup" key={filterGroup.label}>
            {showFieldNames && renderFilterLabel(filterGroup.label)}
            {renderAppliedFilters(filterGroup.filters)}
            {index < appliedFiltersArray.length - 1 && <div className="AppliedFilters__filterSeparator">{delimiter}</div>}
          </div>
        );
      })}
    </div>
  )
}

function renderFilterLabel(label: string): JSX.Element {
  return(
    <div className="AppliedFilters__filterLabel" key={label}>
      <span className="AppliedFilters__filterLabelText">{label}</span>
      <span className="AppliedFilters__filterLabelColon">:</span>
    </div>
  );
}

function renderAppliedFilters(filters: Array<DisplayableFilter>): JSX.Element {
  const filterElems = filters.map((filter: DisplayableFilter, index: number) => {
    return (
      <div className="AppliedFilters__filterValue" key={filter.filterLabel}>
        <span className="AppliedFilters__filterValueText">{filter.filterLabel}</span>
        {index < filters.length - 1 && <span className="AppliedFilters__filterValueComma">,</span>}
      </div>
    );
  });
  return <>{filterElems}</>;
}