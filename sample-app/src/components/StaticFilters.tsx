import { Fragment } from 'react';
import { Filter, Matcher } from '@yext/answers-core';
import { useAnswersActions, useAnswersState } from '@yext/answers-headless-react';
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
  title: string,
  filterSetId: string
}

function CheckboxFilter({ fieldId, value, label, selected, optionHandler }: CheckBoxProps) {
  const filter = {
    fieldId: fieldId,
    matcher: Matcher.Equals,
    value: value
  }
  const id = fieldId + "_" + value
  return (
    <Fragment>
      <label htmlFor={id}>{label}</label>
      <input 
        type="checkbox"
        id={id}
        checked={selected}
        onChange={evt => optionHandler(filter, evt.target.checked)}
      />
    </Fragment>
  );
}

export default function StaticFilters(props: StaticFiltersProps): JSX.Element {
  const answersActions = useAnswersActions();
  const { filterSetId, options, title } = props;

  const filterCollection = useAnswersState(state =>  state.filters.static?.[filterSetId]);
  const getOptionSelectStatus = (option: FilterOption): boolean => {
    const foundFilter = filterCollection?.find(storedFilter => {
      const targetFilter = {
        fieldId: option.fieldId,
        matcher: Matcher.Equals,
        value: option.value
      };
      return isDuplicateFilter(storedFilter.filter, targetFilter); 
    });
    return !!foundFilter && foundFilter.selected;
  };

  const handleFilterOptionChange = (option: Filter, isChecked: boolean) => {
    answersActions.toggleFilterOption(filterSetId, option, isChecked);
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
