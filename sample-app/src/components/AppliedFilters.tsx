import { AppliedQueryFilter, Filter } from '@yext/answers-core';
import { useAnswersState } from '@yext/answers-headless-react';
import { FiltersState } from '@yext/answers-headless/lib/esm/models/slices/filters';
import { groupArray } from '../utils/arrayutils';
import {flattenFilterNodes, isDuplicateFilter} from '../utils/filterutils';
import '../sass/AppliedFilters.scss';

interface Props {
  showFieldNames?: boolean,
  hiddenFields?: Array<string>,
  labelText?: string,
  delimiter?: string
}

const DEFAULT_CONFIG = {
  showFieldNames: true,
  hiddenFields: ['builtin.entityType'],
  labelText: 'Filters applied to this search:',
  delimiter: '|'
}

interface AppliedFilterLabelProps {
  label: string
}

interface AppliedFilterListProps {
  filters: Array<FilterNode>
}

interface GroupedFilters {
  label: string,
  filterDataArray: Array<FilterNode>
}

interface FilterNode {
  filter: Filter,
  filterGroupLabel: string,
  filterLabel: string
}

/**
 * Returns a new list of nlp filter nodes with duplicates of other filter nodes and 
 * filter on hiddenFields removed from the given nlp filter list.
 */
function pruneNlpFilters (nlpFilters: AppliedQueryFilter[], appliedFilters: Filter[], hiddenFields: string[]): AppliedQueryFilter[] {
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
 * list of filters under that same label or category. All filters will convert to FilterNode format
 * where displayValue will be used in the JSX element construction.
 */
function createGroupedFilterNodes(nlpFilters: AppliedQueryFilter[], appliedFilters: Filter[]): Array<GroupedFilters> {
  const getFieldName = (filter: Filter) => filter.fieldId;
  const getNlpFieldName = (filter: AppliedQueryFilter) => filter.displayKey;
  const transformAppliedFilter = (filter: Filter) => ({
    filter: filter,
    filterGroupLabel: filter.fieldId,
    filterLabel: filter.value
  } as FilterNode);
  const transformNlpFilter = (filter: AppliedQueryFilter, index: number) => ({
    filter: filter.filter,
    filterGroupLabel: filter.displayKey,
    filterLabel: filter.displayValue
  } as FilterNode);
  
  let groupedFilters = groupArray(appliedFilters, getFieldName, transformAppliedFilter, {});
  groupArray(nlpFilters, getNlpFieldName, transformNlpFilter, groupedFilters);
  return Object.keys(groupedFilters).map(label => ({
    label: label,
    filterDataArray: groupedFilters[label]
  }) as GroupedFilters);
}

/**
 * Restructure and combine all static filters and facets from given
 * FiltersState into a list of Filter objects
 */
function getAppliedFilters(appliedFiltersState: FiltersState | undefined): Array<Filter> {
  const appliedStaticFilters = flattenFilterNodes(appliedFiltersState?.static, []);
  const appliedFacets = appliedFiltersState?.facets || [];
  
  let appliedFacetFilters: Filter[] = [];
  appliedFacets.forEach((facet) => {
    facet.options.forEach((option) => {
      const filter = {
        fieldId: facet.fieldId,
        matcher: option.matcher,
        value: option.value
      } as Filter;
      appliedFacetFilters.push(filter);
    });
  });
  return [...appliedStaticFilters, ...appliedFacetFilters];
}


/**
 * Renders AppliedFilters component
 */
export default function AppliedFilters(props: Props): JSX.Element {
  const config = {...DEFAULT_CONFIG, ...props};

  let appliedFilters = getAppliedFilters(useAnswersState(state => state.filters));
  appliedFilters = pruneAppliedFilters(appliedFilters, config.hiddenFields);

  let nlpFilters = useAnswersState(state => state.vertical.results?.verticalResults.appliedQueryFilters) || [];
  nlpFilters = pruneNlpFilters(nlpFilters, appliedFilters, config.hiddenFields);

  const appliedFiltersArray: Array<GroupedFilters> = createGroupedFilterNodes(nlpFilters, appliedFilters);

  return (
    <div className="AppliedFilters" aria-label={config.labelText}>
      {appliedFiltersArray.map((filterGroup: GroupedFilters, index: number) => {
        return (
          <div className="AppliedFilters__filterGroup" key={index}>
            {config.showFieldNames && <AppliedFilterLabel label={filterGroup.label}/>}
            <AppliedFilterList filters={filterGroup.filterDataArray}/>
            {index !== appliedFiltersArray.length - 1 && <div className="AppliedFilters__filterSeparator">{config.delimiter}</div>}
          </div>
        );
      })}
    </div>
  )
}

function AppliedFilterLabel(props: AppliedFilterLabelProps): JSX.Element {
  return(
    <div className="AppliedFilters__filterLabel" key="-1">
      <span className="AppliedFilters__filterLabelText">{props.label}</span>
      <span className="AppliedFilters__filterLabelColon">:</span>
    </div>
  );
}

function AppliedFilterList(props: AppliedFilterListProps): JSX.Element {
  const filterElems = props.filters.map((filterNode: FilterNode, index: number) => {
    return (<div className="AppliedFilters__filterValue" key={index}>
      <span className="AppliedFilters__filterValueText">{filterNode.filterLabel}</span>
      {index !== props.filters.length - 1 && <span className="AppliedFilters__filterValueComma">,</span>}
    </div>)
  });
  return <>{filterElems}</>;
}