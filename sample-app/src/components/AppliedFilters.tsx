import { DisplayableFilter } from '../models/displayableFilter';
import { GroupedFilters } from '../models/groupedFilters';
import { ReactComponent as CloseX } from '../icons/x.svg';
import { Matcher, useAnswersActions } from '@yext/answers-headless-react'
import { isNearFilterValue } from '../utils/filterutils';
import { CompositionMethod, useComposedCssClasses } from '../hooks/useComposedCssClasses';

interface AppliedFiltersCssClasses {
  appliedFiltersContainer?: string,
  nlpFilter?: string,
  removableFilter?: string,
  removeFilterButton?: string
}

const builtInCssClasses: AppliedFiltersCssClasses = {
  appliedFiltersContainer: 'flex flex-wrap',
  nlpFilter: 'border rounded-3xl px-3 py-1.5 text-sm font-medium italic text-gray-800 mr-2',
  removableFilter: 'flex items-center border rounded-3xl px-3 py-1.5 text-sm font-medium text-gray-800 mt-2 mr-2',
  removeFilterButton: 'w-2 h-2 text-gray-500 m-1.5'
}

interface Props {
  showFieldNames?: boolean,
  labelText?: string,
  delimiter?: string,
  appliedFilters: Array<GroupedFilters>,
  customCssClasses?: AppliedFiltersCssClasses,
  compositionMethod?: CompositionMethod
}

/**
 * Renders AppliedFilters component
 */
export default function AppliedFilters({
  labelText,
  appliedFilters,
  customCssClasses,
  compositionMethod
}: Props): JSX.Element {
  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses, compositionMethod);

  function renderAppliedFilters(filters: Array<DisplayableFilter>): JSX.Element {
    const filterElems = filters.map((filter: DisplayableFilter, index: number) => {
      if (filter.filterType === 'NLP_FILTER') {
        return <NlpFilter filter={filter} key={filter.label} cssClasses={cssClasses}/>
      }
      return <RemovableFilter filter={filter} key={filter.label}/>
    });
  
    return <>{filterElems}</>;
  }

  return (
    <div className={cssClasses.appliedFiltersContainer} aria-label={labelText}>
      {appliedFilters.map((filterGroup: GroupedFilters) => {
        return renderAppliedFilters(filterGroup.filters);
      })}
    </div>
  )
}

function NlpFilter({ filter, cssClasses = {} }: {filter: DisplayableFilter, cssClasses?: {nlpFilter?: string}}): JSX.Element {
  return (
    <div className={cssClasses.nlpFilter} key={filter.label}>
      <span>{filter.label}</span>
    </div>
  );
}

function RemovableFilter({ filter, cssClasses = {} }: {filter: DisplayableFilter, cssClasses?: {removableFilter?: string, removeFilterButton?: string} }): JSX.Element {
  const answersAction = useAnswersActions();

  const onRemoveFacetOption = () => {
    const { fieldId, matcher, value } = filter.filter;
    if (isNearFilterValue(value)) {
      console.error('A Filter with a NearFilterValue is not a supported RemovableFilter.');
      return;
    }
    answersAction.unselectFacetOption(fieldId, { matcher, value });
    answersAction.executeVerticalQuery();
  }

  const onRemoveStaticFilterOption = () => {
    answersAction.setFilterOption({ ...filter.filter, selected: false });
    answersAction.executeVerticalQuery();
  }

  const onRemoveFilter = filter.filterType === 'FACET' ? onRemoveFacetOption : onRemoveStaticFilterOption;

  return (
    <div className={cssClasses.removableFilter}>
      <div className="">{filter.label}</div>
      <button className={cssClasses.removeFilterButton} onClick={onRemoveFilter}><CloseX/></button>
    </div>
  );
}