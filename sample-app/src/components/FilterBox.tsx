import React from 'react';
import { FilterCombinator, Matcher } from '@yext/answers-core';
import { AnswersActionsContext } from '@yext/answers-headless-react';

interface CheckBoxProps {
  field: string,
  value: string,
  optionHandler: Function
}
interface FilterBoxProps {
  options: {
    field: string,
    value: string
  }[],
  title: string,
}

interface State {
  filtersState: {
    combinator?: FilterCombinator,
    filters: {
      combinator?: FilterCombinator,
      filters: {
        fieldId: string,
        matcher: Matcher,
        value: string
      }[]
    }[]
  }
}

function CheckboxFilter({ field, value, optionHandler }: CheckBoxProps) {
  const filterState = {
    fieldId: field,
    matcher: '$eq' as Matcher,
    value: value
  }
  return (
    <input type="checkbox" id={value} onChange={evt => optionHandler(filterState, evt.target.checked)} />
  );
}

export default class FilterBox extends React.Component<FilterBoxProps, State> {
  constructor(props: FilterBoxProps) {
    super(props)
    this.state = {
      filtersState: {
        filters: []
      }
    };
  }
  addNewFilterOption(filterState: { fieldId: string, matcher: Matcher, value: string }) {
    let fieldIdDoesntExist = true;
    let filters = this.state.filtersState.filters.map(element => {
      if (filterState.fieldId === element.filters[0]?.fieldId) {
        const data = {
          combinator: FilterCombinator.OR,
          filters: element.filters.concat(filterState)
        }
        fieldIdDoesntExist = false;
        return data;
      }
      else {
        return element;
      }
    }
    )
    if (fieldIdDoesntExist) {
      const newFilterState = {
        filters: [filterState]
      }
      filters = this.state.filtersState.filters.concat(newFilterState);
    }
    return filters
  }

  handleCheckedOption(filterState: { fieldId: string, matcher: Matcher, value: string }) {
    let filters = this.addNewFilterOption(filterState);
    if (filters.length > 1) {
      return {
        filtersState: {
          combinator: FilterCombinator.AND,
          filters: filters
        }
      }
    }
    else {
      return {
        filtersState: {
          filters: filters
        }
      }
    }
  }

  formatRemovedFilters(filterRemovedState: { combinator: any; filters: any[]; }[]) {
    const nullRemovedFilters = filterRemovedState.filter(obj => obj)
    let removeables: number[] = []
    const filters = nullRemovedFilters.map((element, index) => {
      if (element.filters.length === 1) {
        const data = {
          filters: element.filters
        }
        return data;
      }
      else if (element.filters.length < 1) {
        removeables.push(index)
        return element
      }
      else {
        return element;
      }
    })
    for (var i = 0; i < filters.length; i++) {
      if (removeables.includes(i)) {
        filters.splice(i, 1);
        i--;
      }
    }
    return filters
  }

  handleUncheckedOption(filterState: { fieldId: string, matcher: Matcher, value: string }) {
    const filterRemovedState = this.state.filtersState.filters.map(element => {
      const data = {
        combinator: FilterCombinator.OR,
        filters: element.filters.filter(obj => obj.value !== filterState.value)
      }
      return data
    }
    )
    let filters = this.formatRemovedFilters(filterRemovedState);
    if (filters.length > 1) {
      return {
        filtersState: {
          combinator: FilterCombinator.AND,
          filters: filters
        }
      }
    }
    else if (filters.length === 1) {
      return {
        filtersState: {
          filters: filters
        }
      }
    }
    else {
      return {
        filtersState: {
          filters: []
        }
      }
    }
  }

  handleOptionSelection = (filterState: { fieldId: string, matcher: Matcher, value: string }, isChecked: boolean) => {
    let state: {
      filtersState: any
    };
    if (isChecked) {
      state = this.handleCheckedOption(filterState);
    }
    else {
      state = this.handleUncheckedOption(filterState);
    }
    this.setState(state, () => {
      this.setFilters();
    })
  }

  setFilters() {
    const filtersState = this.state.filtersState
    if (filtersState.combinator === undefined) {
      if (filtersState.filters.length === 0)
        this.context.setFilter(null);
      else if (filtersState.filters.length === 1) {
        if (filtersState.filters[0].combinator === undefined) {
          this.context.setFilter(filtersState.filters[0].filters[0])
        }
        else {
          this.context.setFilter(filtersState.filters[0])
        }
      }
    }
    else {
      const revisedFilterState = filtersState.filters.map(element => {
        if (element.combinator === undefined) {
          return element.filters[0]
        }
        else {
          return element
        }
      })
      const returnedFilterState = {
        combinator: FilterCombinator.AND,
        filters: revisedFilterState
      }
      this.context.setFilter(returnedFilterState)
    }
    this.context.executeVerticalQuery();
  }

  renderFilters(field: string, value: string) {
    return (
      <React.Fragment>
        {value}
        <CheckboxFilter
          field={field}
          value={value}
          optionHandler={this.handleOptionSelection}
        />
      </React.Fragment>
    )
  }
  render() {
    return (
      <fieldset>
        <legend>{this.props.title}</legend>
        <div>
          {this.props.options.map((value, index) => (
            <div key={index}>
              {this.renderFilters(value.field, value.value)}
            </div>
          ))}
        </div>
      </fieldset>
    );
  }
}

FilterBox.contextType = AnswersActionsContext;