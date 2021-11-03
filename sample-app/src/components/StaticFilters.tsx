import { Fragment, useState } from 'react';
import { Filter, Matcher } from '@yext/answers-core';
import { useAnswersActions, useAnswersState } from '@yext/answers-headless-react';
import { SelectableFilter } from '@yext/answers-headless/lib/commonjs/models/utils/selectablefilter';
import { AnswersHeadless } from '@yext/answers-headless';

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
        id={id} checked={selected}
        onChange={evt => optionHandler(filter, evt.target.checked)}
      />
    </Fragment>
  );
}

function setupInitialFilterState(answersActions: AnswersHeadless, filterSetId: string, filters: FilterOption[]) {
  const initialFilters: SelectableFilter[] = filters.map(option => ({
    filter: {
      fieldId: option.fieldId,
      matcher: Matcher.Equals,
      value: option.value
    },
    selected: false
  }));
  answersActions.addFilters(filterSetId, initialFilters);
}

export default function StaticFilters(props: StaticFiltersProps): JSX.Element {
  const answersActions = useAnswersActions();
  const { filterSetId, options, title } = props;
  useState(setupInitialFilterState.bind(null, answersActions, filterSetId, options));

  const filters = useAnswersState(state =>  state.filters.static?.[filterSetId]);
  const getOptionSelectStatus = (filters: SelectableFilter[] | null | undefined, index: number) => {
    if (!filters) {
      console.error(`Unable to find following filter select status: ${JSON.stringify(options[index])}`);
      return false;
    }
    return filters[index].selected;
  };

  const handleFilterOptionChange = (option: Filter, isChecked: boolean) => {
    isChecked
      ?  answersActions.selectFilterOption(option, filterSetId)
      :  answersActions.unselectFilterOption(option, filterSetId);
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
              selected={getOptionSelectStatus(filters, index)}
              optionHandler={handleFilterOptionChange}
            />
          </div>
        ))}
      </div>
    </fieldset>
  );
}
