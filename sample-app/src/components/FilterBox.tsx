import React, { Fragment } from 'react';
import { Filter, FilterCombinator, Matcher } from '@yext/answers-core';
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
  const filterState = {
    fieldId: fieldId,
    matcher: Matcher.Equals,
    value: value
  }
  const id = fieldId + "_" + value
  return (
    <Fragment>
      <label htmlFor={id}>{label}</label>
      <input type="checkbox" id={id} onChange={evt => optionHandler(filterState, evt.target.checked)}/>
    </Fragment>
  );
}

export default class FilterBox extends React.Component<FilterBoxProps, State> {
  constructor(props: FilterBoxProps) {
    super(props)
    const filtersState: FiltersState = {}
    props.options.forEach(element => {
      filtersState[element.fieldId] = []
    })
    this.state = { filtersState };
  }

  handleOptionSelection = (filter: Filter, isChecked: boolean) => {
    isChecked 
      ? this.handleCheckedOption(filter)
      : this.handleUncheckedOption(filter);
  }

  handleCheckedOption(filter: Filter) {
    let filters = this.state.filtersState[filter.fieldId]
    let filtersState = this.state.filtersState
    filtersState[filter.fieldId] = [...filters, filter]
    this.setState({
      filtersState: filtersState
    }, () => {
      this.setFilters()
    })
  }

  handleUncheckedOption(filter: Filter) {
    let filters = this.state.filtersState[filter.fieldId]
    let filtersState = this.state.filtersState
    filtersState[filter.fieldId] = filters.filter(filterOption => filterOption.value !== filter.value)
    this.setState({
      filtersState: filtersState
    }, () => {
      this.setFilters()
    })
  }
  
  setFilters() {
    const filtersState = this.state.filtersState
    this.context.setFilter(formatFilters(filtersState))
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

function formatFilters(filtersState: FiltersState) {
  let keys = Object.keys(filtersState).filter(obj => filtersState[obj].length > 0)
  let filters = keys.map(key => filtersState[key])
  if (filters.length === 0) {
    return null
  }
  if (filters.length === 1) {
    return formatOrFilters(filters[0])
  }
  else {
    return {
      combinator: FilterCombinator.AND,
      filters: filters.map(filter => formatOrFilters(filter))
    }
  }
}

function formatOrFilters(filters: Filter[]) {
  if (filters.length === 1) {
    return filters[0]
  }
  else {
    return { 
      combinator: FilterCombinator.OR,
      filters: filters
    }
  }
}

FilterBox.contextType = AnswersActionsContext;