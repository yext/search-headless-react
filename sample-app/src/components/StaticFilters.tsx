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
  config: {
    options: FilterOption[],
    title: string
  }[]
}

function CheckboxFilter({ fieldId, value, label, selected, optionHandler }: CheckBoxProps) {
  const filter = {
    fieldId: fieldId,
    matcher: Matcher.Equals,
    value: value
  }
  const id = fieldId + "_" + value
  return (
    <div className='flex items-center space-x-3'>
      <input 
        type="checkbox"
        id={id}
        checked={selected}
        className='w-3.5 h-3.5 form-checkbox border border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500'
        onChange={evt => optionHandler(filter, evt.target.checked)}
      />
      <label className='text-gray-500 text-sm font-normal'htmlFor={id}>{label}</label>
    </div>
  );
}

export default function StaticFilters(props: StaticFiltersProps): JSX.Element {
  const answersActions = useAnswersActions();
  const { config } = props;

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
    <div className='pt-7'>
      {config.map((filterSet, index) => {
        return <fieldset>
          <legend className='text-gray-900 text-sm font-medium mb-4'>{filterSet.title}</legend>
          <div className='flex flex-col space-y-3'>
            {filterSet.options.map((option, index) => (
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
          {index !== config.length-1 && divider()}
        </fieldset>
      })}
    </div>
  );
}

function divider() {
  return <div className='w-full h-px bg-gray-200 my-4'></div>
}