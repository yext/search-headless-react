import { useAnswersActions, useAnswersState, Filter, Matcher } from '@yext/answers-headless-react';
import { isDuplicateFilter } from '../utils/filterutils';

interface CheckBoxProps {
  fieldId: string,
  value: string,
  label: string,
  selected: boolean,
  optionHandler: Function
}

interface FilterOption {
  fieldId: string,
  value: string,
  label: string
}

interface StaticFiltersProps {
  options: FilterOption[],
  title: string
}

function CheckboxFilter({ fieldId, value, label, selected, optionHandler }: CheckBoxProps) {
  const filter = {
    fieldId: fieldId,
    matcher: Matcher.Equals,
    value: value
  }
  const id = fieldId + "_" + value
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input 
        type="checkbox"
        id={id}
        checked={selected}
        onChange={evt => optionHandler(filter, evt.target.checked)}
      />
    </>
  );
}

export default function StaticFilters(props: StaticFiltersProps): JSX.Element {
  const answersActions = useAnswersActions();
  const { options, title } = props;

  const selectableFilters = useAnswersState(state =>  state.filters.static);
  const getOptionSelectStatus = (option: FilterOption): boolean => {
    const foundFilter = selectableFilters?.find(storedSelectableFilter => {
      const { selected, ...storedFilter } = storedSelectableFilter;
      const targetFilter = {
        fieldId: option.fieldId,
        matcher: Matcher.Equals,
        value: option.value
      };
      return isDuplicateFilter(storedFilter, targetFilter); 
    });
    return !!foundFilter && foundFilter.selected;
  };

  const handleFilterOptionChange = (option: Filter, isChecked: boolean) => {
    answersActions.resetFacets();
    answersActions.setFilterOption({ ...option, selected: isChecked });
    answersActions.executeVerticalQuery();
  }

  return (
    <fieldset>
      <legend>{title}</legend>
      <div>
        {options.map((option, index) => (
          <div key={index}>
            <CheckboxFilter
              fieldId={option.fieldId}
              value={option.value}
              label={option.label}
              selected={getOptionSelectStatus(option)}
              optionHandler={handleFilterOptionChange}
            />
          </div>
        ))}
      </div>
    </fieldset>
  );
}
