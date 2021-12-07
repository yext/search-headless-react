import { useAnswersActions, useAnswersState, Filter, Matcher } from '@yext/answers-headless-react';
import { CompositionMethod, useComposedCssClasses } from '../hooks/useComposedCssClasses';
import { isDuplicateFilter } from '../utils/filterutils';

interface CheckBoxProps {
  fieldId: string,
  value: string,
  label: string,
  selected: boolean,
  optionHandler: Function,
  cssClasses?: Pick<StaticFiltersCssClasses, 'option' | 'optionInput' | 'optionLabel'>
}

interface FilterOption {
  fieldId: string,
  value: string,
  label: string
}

interface StaticFiltersProps {
  filterConfig: {
    options: FilterOption[],
    title: string
  }[],
  customCssClasses?: StaticFiltersCssClasses,
  cssCompositionMethod?: CompositionMethod
}

interface StaticFiltersCssClasses {
  container?: string,
  title?: string,
  optionsContainer?: string,
  option?: string,
  optionInput?: string,
  optionLabel?: string,
  divider?: string
}

const builtInCssClasses: StaticFiltersCssClasses = {
  container: 'md:w-40',
  title: 'text-gray-900 text-sm font-medium mb-4',
  optionsContainer: 'flex flex-col space-y-3',
  option: 'flex items-center space-x-3',
  optionInput: 'w-3.5 h-3.5 form-checkbox border border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500',
  optionLabel: 'text-gray-500 text-sm font-normal'
}

export default function StaticFilters(props: StaticFiltersProps): JSX.Element {
  const answersActions = useAnswersActions();
  const { filterConfig, customCssClasses, cssCompositionMethod } = props;
  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses, cssCompositionMethod);

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
    <div className={cssClasses.container}>
      {filterConfig.map((filterSet, index) => {
        const isLastFilterSet = index === filterConfig.length - 1;
        return <fieldset key={`${index}-${filterSet.title}`}>
          <legend className={cssClasses.title}>{filterSet.title}</legend>
          <div className={cssClasses.optionsContainer}>
            {filterSet.options.map((option, index) => (
              <CheckboxFilter
                fieldId={option.fieldId}
                value={option.value}
                label={option.label}
                key={index}
                selected={getOptionSelectStatus(option)}
                optionHandler={handleFilterOptionChange}
                cssClasses={cssClasses}
              />
            ))}
          </div>
          {!isLastFilterSet && <Divider customCssClasses={{ divider: cssClasses.divider }}/>}
        </fieldset>
      })}
    </div>
  );
}

function CheckboxFilter({ fieldId, value, label, selected, optionHandler, cssClasses = {} }: CheckBoxProps) {
  const filter = {
    fieldId: fieldId,
    matcher: Matcher.Equals,
    value: value
  }
  const id = fieldId + "_" + value
  return (
    <div className={cssClasses.option}>
      <input 
        type="checkbox"
        id={id}
        checked={selected}
        className={cssClasses.optionInput}
        onChange={evt => optionHandler(filter, evt.target.checked)}
      />
      <label className={cssClasses.optionLabel} htmlFor={id}>{label}</label>
    </div>
  );
}

interface DividerProps {
  customCssClasses?: {
    divider?: string
  },
  cssCompositionMethod?: CompositionMethod
}

export function Divider({ customCssClasses, cssCompositionMethod }: DividerProps) {
  const builtInCssClasses = {
    divider: 'w-full h-px bg-gray-200 my-4'
  }
  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses, cssCompositionMethod);
  return <div className={cssClasses.divider}></div>
}