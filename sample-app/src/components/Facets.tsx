import { useAnswersState, useAnswersActions } from '@yext/answers-headless-react'
import { DisplayableFacet, DisplayableFacetOption } from "@yext/answers-core";
import { useState } from 'react';
import useCollapse from 'react-collapsed';
import '../sass/Facets.scss';

interface FacetConfig {
  searchable?: boolean
  placeholderText?: string
  label?: string
}
interface Props {
  searchOnChange?: boolean
  collapsible?: boolean
  defaultExpanded?: boolean
  applyLabel?: string
  resetFacetLabel?: string
  fieldConfig?: Record<string, FacetConfig>
}

export default function Facets (props: Props): JSX.Element {
  const { searchOnChange } = props;
  const collapsible = !!props.collapsible;
  const defaultExpanded = !!props.defaultExpanded;
  const facets = useAnswersState(state => state.filters?.facets) || [];
  const answersActions = useAnswersActions();

  const handleApplyFacets = () => answersActions.executeVerticalQuery();

  const handleResetFacets = () => {
    facets.forEach(facet => {
      facet.options?.forEach(option => { 
        answersActions.unselectFacetOption(facet.fieldId, option)
      });
    });
    answersActions.executeVerticalQuery()
  }

  const handleFacetOptionChange = (fieldId: string, option: DisplayableFacetOption) => {
    option.selected
      ?  answersActions.unselectFacetOption(fieldId, option)
      :  answersActions.selectFacetOption(fieldId, option);
    
    if (searchOnChange) { 
      answersActions.executeVerticalQuery()
    }
  }

  return (
    <div className='Facets'>
      <div className='Facets__options'>
        {facets.filter((facet: DisplayableFacet) => {
            return facet.options?.length > 0
          }).map((facet: DisplayableFacet) => {
          const config = props.fieldConfig?.[facet.fieldId] ?? {};
          return <Facet key={facet.fieldId} collapsible={collapsible} defaultExpanded={defaultExpanded} facet={facet} 
            config={config} onChange={handleFacetOptionChange} />
        })}
      </div>
      <div className='Facets__controls'>
        <button className={`Facets__button`} onClick={handleApplyFacets}>{props.applyLabel || 'Apply'}</button>
        <button className={`Facets__link`} onClick={handleResetFacets}>{props.resetFacetLabel || 'Reset all'}</button>
      </div>
    </div>
  )
}

function Facet(props: { facet: DisplayableFacet, collapsible: boolean, defaultExpanded: boolean, onChange: Function, config: FacetConfig }): JSX.Element {
  const { facet, onChange, config, collapsible, defaultExpanded } = props;
  const answersActions = useAnswersActions();
  const hasSelectedFacet = !!facet.options.find(o => o.selected);
  const shouldExpand = collapsible && (defaultExpanded || hasSelectedFacet);
  const [ filterValue, setFilterValue ] = useState('');
  const { getCollapseProps, getToggleProps } = useCollapse({
    defaultExpanded: shouldExpand
  });

	return (
    <div className="Facet">
      <fieldset className={"Facet__fieldSet"}>
        <button className={"Facet__legend"} {...(collapsible && getToggleProps())}>
          {config.label || facet.displayName} 
        </button>
        <div className="Facet__optionsContainer" {...(collapsible && getCollapseProps())}>
          {config.searchable 
            && <input className="Facet__search" 
                type="text" 
                placeholder={config.placeholderText || "Search here..."} 
                value={filterValue} 
                onChange={(e) => setFilterValue(e.target.value)}/>}
          <div className="Facet__options">
            {answersActions.searchThroughFacet(facet, filterValue).options.map((option) =>
              <FacetOption key={option.displayName} fieldId={facet.fieldId} option={option} onChange={onChange} />
            )}
          </div>
        </div>
      </fieldset>
    </div>
  )
}

function FacetOption(props: { fieldId: string, option: DisplayableFacetOption, onChange: any }): JSX.Element {
  const { fieldId, onChange, option } = props;
  return (
    <div>
      <input onChange={() => onChange(fieldId, option)} checked={option.selected} type="checkbox" id={option.displayName} />
      <label className={"Facet__label"} htmlFor={option.displayName}>{option.displayName} ({option.count})</label>
    </div>
  )
}
