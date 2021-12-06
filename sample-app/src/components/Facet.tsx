import { useAnswersUtilities, DisplayableFacet, DisplayableFacetOption } from '@yext/answers-headless-react'
import { useState } from 'react';
import useCollapse from 'react-collapsed';
import { CompositionMethod, useComposedCssClasses } from '../hooks/useComposedCssClasses';

export type onFacetChangeFn = (fieldId: string, option: DisplayableFacetOption) => void

export interface FacetTextConfig {
  placeholderText?: string,
  label?: string
}

interface FacetProps extends FacetTextConfig {
  facet: DisplayableFacet,
  searchable?: boolean,
  collapsible?: boolean,
  defaultExpanded?: boolean,
  onToggle: onFacetChangeFn,
  customCssclasses?: FacetCssClasses,
  cssCompositionMethod?: CompositionMethod
}

interface FacetCssClasses {
  facetLabel?: string,
  optionsContainer?: string,
  option?: string,
  optionInput?: string,
  optionLabel?: string
}

const builtInCssClasses: FacetCssClasses = {
  facetLabel: 'text-gray-900 text-sm font-medium mb-4',
  optionsContainer: 'flex flex-col space-y-3',
  option: 'flex items-center space-x-3',
  optionInput: 'w-3.5 h-3.5 form-checkbox border border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500',
  optionLabel: 'text-gray-500 text-sm font-normal'
}

export default function Facet(props: FacetProps): JSX.Element {
  const { 
    facet,
    onToggle,
    searchable,
    collapsible,
    defaultExpanded,
    label,
    placeholderText,
    customCssclasses,
    cssCompositionMethod 
  } = props;
  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssclasses, cssCompositionMethod);
  const answersUtilities = useAnswersUtilities();
  const hasSelectedFacet = !!facet.options.find(o => o.selected);
  const [ filterValue, setFilterValue ] = useState('');
  const { getCollapseProps, getToggleProps } = useCollapse({
    defaultExpanded: hasSelectedFacet || defaultExpanded
  });

  const facetOptions = searchable
    ? answersUtilities.searchThroughFacet(facet, filterValue).options
    : facet.options;

  return (
    <fieldset>
      <button className={cssClasses.facetLabel} {...(collapsible ? getToggleProps() : {})}>
        {label || facet.displayName} 
      </button>
      <div {...(collapsible ? getCollapseProps() : {})}>
        {searchable 
          && <input
            className='Facet__search' 
            type='text' 
            placeholder={placeholderText || 'Search here...'} 
            value={filterValue} 
            onChange={e => setFilterValue(e.target.value)}/>}
        <div className={cssClasses.optionsContainer}>
          {facetOptions.map(option => 
            <FacetOption 
              key={option.displayName} 
              fieldId={facet.fieldId}
              option={option}
              onToggle={onToggle}
              cssClasses={cssClasses}/>
          )}
        </div>
      </div>
    </fieldset>
  )
}

interface FacetOptionProps { 
  fieldId: string, 
  option: DisplayableFacetOption, 
  onToggle: onFacetChangeFn,
  cssClasses?: Pick<FacetCssClasses, 'option' | 'optionInput' | 'optionLabel'>
}

function FacetOption(props: FacetOptionProps): JSX.Element {
  const { fieldId, onToggle, option, cssClasses = {} } = props;
  return (
    <div className={cssClasses.option}>
      <input
        className={cssClasses.optionInput}
        onChange={() => onToggle(fieldId, option)}
        checked={option.selected}
        type='checkbox'
        id={option.displayName}
      />
      <label className={cssClasses.optionLabel} htmlFor={option.displayName}>{option.displayName} ({option.count})</label>
    </div>
  )
}
