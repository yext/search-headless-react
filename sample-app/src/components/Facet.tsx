import { useAnswersActions } from '@yext/answers-headless-react'
import { DisplayableFacet, DisplayableFacetOption } from "@yext/answers-core";
import { useState } from 'react';
import useCollapse from 'react-collapsed';
import '../sass/Facet.scss';

export type onFacetChangeFn = (fieldId: string, option: DisplayableFacetOption) => void

export interface FacetConfig {
  searchable?: boolean
  placeholderText?: string
  label?: string
}

interface FacetProps {
  facet: DisplayableFacet,
  collapsible?: boolean,
  defaultExpanded?: boolean,
  onChange: onFacetChangeFn,
  config: FacetConfig
}

export default function Facet(props: FacetProps): JSX.Element {
  const { facet, onChange, config, collapsible, defaultExpanded } = props;
  const answersActions = useAnswersActions();
  const hasSelectedFacet = !!facet.options.find(o => o.selected);
  const shouldExpand = collapsible && (defaultExpanded || hasSelectedFacet);
  const [ filterValue, setFilterValue ] = useState('');
  const { getCollapseProps, getToggleProps } = useCollapse({
    defaultExpanded: shouldExpand
  });

  const facetOptions = config.searchable
    ? answersActions.searchThroughFacet(facet, filterValue).options
    : facet.options;

	return (
    <div className="Facet">
      <fieldset className={"Facet__fieldSet"}>
        <button className={"Facet__legend"} {...(collapsible ? getToggleProps() : {})}>
          {config.label || facet.displayName} 
        </button>
        <div className="Facet__optionsContainer" {...(collapsible ? getCollapseProps() : {})}>
          {config.searchable 
            && <input className="Facet__search" 
                type="text" 
                placeholder={config.placeholderText || "Search here..."} 
                value={filterValue} 
                onChange={(e) => setFilterValue(e.target.value)}/>}
          <div className="Facet__options">
            {facetOptions.map(option => 
              <FacetOption key={option.displayName} fieldId={facet.fieldId} option={option} onChange={onChange} />
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
  onChange: Function
}

function FacetOption(props: FacetOptionProps): JSX.Element {
  const { fieldId, onChange, option } = props;
  return (
    <div>
      <input onChange={() => onChange(fieldId, option)} checked={option.selected} type="checkbox" id={option.displayName} />
      <label className={"Facet__label"} htmlFor={option.displayName}>{option.displayName} ({option.count})</label>
    </div>
  )
}
