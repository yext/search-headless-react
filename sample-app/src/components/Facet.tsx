import { useAnswersActions } from '@yext/answers-headless-react'
import { DisplayableFacet, DisplayableFacetOption } from "@yext/answers-core";
import { useState } from 'react';
import useCollapse from 'react-collapsed';
import '../sass/Facet.scss';

export type onFacetChangeFn = (fieldId: string, option: DisplayableFacetOption) => void

export interface FacetTextConfig {
  placeholderText?: string
  label?: string
}

interface FacetProps extends FacetTextConfig {
  facet: DisplayableFacet,
  searchable?: boolean,
  collapsible?: boolean,
  defaultExpanded?: boolean,
  onToggle: onFacetChangeFn
}

export default function Facet(props: FacetProps): JSX.Element {
  const { facet, onToggle, searchable, collapsible, defaultExpanded, placeholderText, label } = props;
  const answersActions = useAnswersActions();
  const hasSelectedFacet = !!facet.options.find(o => o.selected);
  const shouldExpand = defaultExpanded || hasSelectedFacet;
  const [ filterValue, setFilterValue ] = useState('');
  const { getCollapseProps, getToggleProps } = useCollapse({
    defaultExpanded: shouldExpand
  });

  const facetOptions = searchable
    ? answersActions.searchThroughFacet(facet, filterValue).options
    : facet.options;

  return (
    <div className="Facet">
      <fieldset className="Facet__fieldSet">
        <button className="Facet__legend" {...(collapsible ? getToggleProps() : {})}>
          {label || facet.displayName} 
        </button>
        <div className="Facet__optionsContainer" {...(collapsible ? getCollapseProps() : {})}>
          {searchable 
            && <input className="Facet__search" 
                type="text" 
                placeholder={placeholderText || "Search here..."} 
                value={filterValue} 
                onChange={e => setFilterValue(e.target.value)}/>}
          <div className="Facet__options">
            {facetOptions.map(option => 
              <FacetOption key={option.displayName} fieldId={facet.fieldId} option={option} onToggle={onToggle} />
            )}
          </div>
        </div>
      </fieldset>
    </div>
  )
}

interface FacetOptionProps { 
  fieldId: string, 
  option: DisplayableFacetOption, 
  onToggle: onFacetChangeFn
}

function FacetOption(props: FacetOptionProps): JSX.Element {
  const { fieldId, onToggle, option } = props;
  return (
    <div>
      <input onChange={() => onToggle(fieldId, option)} checked={option.selected} type="checkbox" id={option.displayName} />
      <label className="Facet__label" htmlFor={option.displayName}>{option.displayName} ({option.count})</label>
    </div>
  )
}
