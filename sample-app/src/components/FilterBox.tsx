import React from 'react';
import { CombinedFilter, Filter, FilterCombinator, Matcher } from '@yext/answers-core';
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
  options: {
    field: string,
    value: string
  }[],
  title: string,
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

class CheckboxFilter extends React.Component<CheckBoxProps>{
  render() {
    const filterState = {
      fieldId: this.props.field,
      matcher: '$eq' as Matcher,
      value: this.props.value
    }
    return (
      <input type="checkbox" id={this.props.value} onChange={evt => this.props.optionHandler(filterState, evt.target.checked)} />
    );
  }
}

export default class FilterBox extends React.Component<FilterBoxProps, State> {
  constructor(props: FilterBoxProps, context: any) {
    super(props)
    const { options, title } = props
    this.state = {
      title: title,
      options: options,
      filtersState: {
        filters: []
      }
    };
  }

  handleOptionSelection = (filterState: { fieldId: string, matcher: Matcher, value: string }, isChecked: boolean) => {
    if (isChecked) {
      let fieldIdDoesntExist = true;
      let filterAddState = this.state.filtersState.filters.map(element => {
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
        filterAddState = this.state.filtersState.filters.concat(newFilterState);
      }
      if (filterAddState.length > 1) {
        this.setState({
          title: this.props.title,
          options: this.props.options,
          filtersState: {
            combinator: FilterCombinator.AND,
            filters: filterAddState
          }
        }, () => {
          this.setFilters();
        })
      }
      else {
        this.setState({
          title: this.props.title,
          options: this.props.options,
          filtersState: {
            filters: filterAddState
          }
        }, () => {
          this.setFilters();
        })
      }

    }
    else {
      const filterRemovedState = this.state.filtersState.filters.map(element => {
        const data = {
          combinator: FilterCombinator.OR,
          filters: element.filters.filter(obj => obj.value !== filterState.value)
        }
        return data
      }
      )
      const nullRemovedState = filterRemovedState.filter(obj => obj)
      const removeables: number[] = []
      const andFilter = nullRemovedState.map((element, index) => {
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
      for (var i = 0; i < andFilter.length; i++) {
        if (removeables.includes(i)) {
          andFilter.splice(i, 1);
          i--;
        }
      }
      if (andFilter.length > 1) {
        this.setState({
          title: this.props.title,
          options: this.props.options,
          filtersState: {
            combinator: FilterCombinator.AND,
            filters: andFilter
          }
        }, () => {
          this.setFilters();
        })
      }
      else if (andFilter.length === 1) {
        this.setState({
          title: this.props.title,
          options: this.props.options,
          filtersState: {
            filters: andFilter
          }
        }, () => {
          this.setFilters();
        })
      }
      else {
        this.setState({
          title: this.props.title,
          options: this.props.options,
          filtersState: {
            filters: []
          }
        }, () => {
          this.setFilters();
        })
      }
    }
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
      }) as (Filter | CombinedFilter[])
      const returnedFilterState = {
        combinator: FilterCombinator.AND,
        filters: revisedFilterState
      }
      console.log(returnedFilterState)
      this.context.setFilter(returnedFilterState)
    }
    this.context.executeVerticalQuery();
  }

  renderFilters(field: string, value: string) {
    return (
      <div>
        {value}
        <CheckboxFilter
          field={field}
          value={value}
          optionHandler={this.handleOptionSelection}
        />
      </div>
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