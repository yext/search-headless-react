import { DisplayableFilter } from '../models/displayableFilter';
import { GroupedFilters } from '../models/groupedFilters';
import '../sass/AppliedFilters.scss';

interface Props {
  showFieldNames?: boolean,
  labelText?: string,
  delimiter?: string,
  appliedFilters: Array<GroupedFilters>
}

/**
 * Renders AppliedFilters component
 */
export default function AppliedFilters({ showFieldNames, labelText, delimiter, appliedFilters }: Props): JSX.Element {
  return (
    <div className="AppliedFilters" aria-label={labelText}>
      {appliedFilters.map((filterGroup: GroupedFilters, index: number) => {
        return (
          <div className="AppliedFilters__filterGroup" key={filterGroup.label}>
            {showFieldNames && renderFilterLabel(filterGroup.label)}
            {renderAppliedFilters(filterGroup.filters)}
            {index < appliedFilters.length - 1 && <div className="AppliedFilters__filterSeparator">{delimiter}</div>}
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
      <div className="AppliedFilters__filterValue" key={filter.label}>
        <span className="AppliedFilters__filterValueText">{filter.label}</span>
        {index < filters.length - 1 && <span className="AppliedFilters__filterValueComma">,</span>}
      </div>
    );
  });
  return <>{filterElems}</>;
}