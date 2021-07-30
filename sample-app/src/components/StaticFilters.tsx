import { CombinedFilter, Filter, FilterCombinator, Matcher } from '@yext/answers-core';
import { useEffect, useState } from 'react';
import { useStoreActions } from '@yext/answers-headless-react';

interface Props {
  options: {
    field: string,
    value: string
  }[],
  title: string
}

export default function StaticFilters({ options, title }: Props) {
  const [selectedFilters, updateSelectedFilters] = useState<boolean[]>([])
  const storeActions = useStoreActions();
  useEffect(() => {
    const filtersState = selectedFilters
      .map((isChecked, index) => {
        if (!isChecked) return null
        const { field, value } = options[index];
        return {
          fieldId: field,
          matcher: '$eq' as Matcher,
          value
        }
    }).filter(x => x) as (Filter|CombinedFilter)[]
    if (!filtersState.length) {
      storeActions.setFilter(null);
    } else if (filtersState.length === 1) {
      storeActions.setFilter(filtersState[0])
    } else {
      const filter = {
        combinator: FilterCombinator.AND,
        filters: filtersState
      };
      storeActions.setFilter(filter)
    }
    storeActions.executeVerticalQuery();
  })

  const handleOptionSelection = (index: number, isChecked: boolean) => {
    updateSelectedFilters(prevSelectedFilters => {
      const selectedFilters = [...prevSelectedFilters]
      selectedFilters[index] = isChecked
      return selectedFilters
    })
  }

  return (
    <fieldset>
      <legend>{title}</legend>
      <div>
        {options.map(( { value }, index) => (
          <div key={index}>
            <input
              id={value + '-' + index}
              type='checkbox'
              value={index}
              onChange={evt => handleOptionSelection(index, evt.target.checked)}
            />
            <label htmlFor={value + '-' + index}>{value}</label>
          </div>
        ))}
      </div>
    </fieldset>
  )
}