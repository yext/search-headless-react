import React, { Fragment } from 'react';
import { Filter, CombinedFilter, FilterCombinator, Matcher } from '@yext/answers-core';
import { AnswersActionsContext } from '@yext/answers-headless-react';

interface CheckBoxProps {
  fieldId: string,
  value: string,
  label: string,
  optionHandler: Function
}
interface FilterBoxProps {
  options: {
    fieldId: string,
    value: string,
    label: string
  }[],
  title: string,
}

interface FiltersState {
  [fieldId: string]: Filter[]
}
interface State {
  filtersState: FiltersState
}

function CheckboxFilter({ fieldId, value, label, optionHandler }: CheckBoxProps) {
  const filter = {
    fieldId: fieldId,
    matcher: Matcher.Equals,
    value: value
  }
  const id = fieldId + "_" + value
  return (
    <Fragment>
      <label htmlFor={id}>{label}</label>
      <input type="checkbox" id={id} onChange={evt => optionHandler(filter, evt.target.checked)}/>
    </Fragment>
  );
}

export default class StaticFilters extends React.Component<FilterBoxProps, State> {
  constructor(props: FilterBoxProps) {
    super(props)
    const filtersState: FiltersState = {}
    props.options.forEach(option => {
      filtersState[option.fieldId] = []
    })
    this.state = { filtersState };
  }

  handleOptionSelection = (filter: Filter, isChecked: boolean) => {
    const filtersState = this.state.filtersState
    const filters = filtersState[filter.fieldId]
    
    isChecked 
      ? filtersState[filter.fieldId] = [...filters, filter]
      : filtersState[filter.fieldId] = filters.filter(filterOption => filterOption.value !== filter.value)
    this.setState({
      filtersState: filtersState
    }, () => {
      this.setFilters()
    })
  }

  setFilters() {
    const formattedFilter = formatFilters(this.state.filtersState)
    this.context.setFilter(formattedFilter)
    this.context.executeVerticalQuery();
  }

  render() {
    return (
      <fieldset>
        <legend>{this.props.title}</legend>
        <div>
          {this.props.options.map((option, index) => (
            <div key={index}>
              <CheckboxFilter
                fieldId={option.fieldId}
                value={option.value}
                label={option.label}
                optionHandler={this.handleOptionSelection}
              />
            </div>
          ))}
        </div>
      </fieldset>
    );
  }
}

function formatFilters(filtersState: FiltersState): Filter | CombinedFilter | null {
  let fieldIds = Object.keys(filtersState).filter(fieldId => filtersState[fieldId].length > 0)
  if (fieldIds.length === 0) {
    return null
  }
  let filtersArrays = fieldIds.map(fieldId => filtersState[fieldId])
  if (filtersArrays.length === 1) {
    return formatOrFilters(filtersArrays[0])
  }
  return {
    combinator: FilterCombinator.AND,
    filters: filtersArrays.map(filter => formatOrFilters(filter))
  }
}

function formatOrFilters(filters: Filter[]) {
  if (filters.length === 1) {
    return filters[0]
  }
  return { 
    combinator: FilterCombinator.OR,
    filters: filters
  }
}

StaticFilters.contextType = AnswersActionsContext;