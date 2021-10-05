import { useAnswersState, useAnswersActions } from '@yext/answers-headless-react'
import { DisplayableFacetOption } from "@yext/answers-core";
import Facet, { FacetTextConfig } from './Facet';
import '../sass/Facets.scss';


interface FacetsProps {
  searchOnChange?: boolean,
  searchable?: boolean,
  collapsible?: boolean,
  defaultExpanded?: boolean,
  facetConfigs?: Record<string, FacetTextConfig>
}

export default function Facets (props: FacetsProps): JSX.Element {
  const { searchOnChange, searchable, collapsible, defaultExpanded, facetConfigs = {} } = props;
  const facets = useAnswersState(state => state.filters?.facets) || [];

  const answersActions = useAnswersActions();
  const executeSearch = () => answersActions.executeVerticalQuery();

  const handleResetFacets = () => {
    answersActions.resetFacets();
    if (searchOnChange) { 
      executeSearch();
    }
  }

  const handleFacetOptionChange = (fieldId: string, option: DisplayableFacetOption) => {
    option.selected
      ?  answersActions.unselectFacetOption(fieldId, option)
      :  answersActions.selectFacetOption(fieldId, option);
    
    if (searchOnChange) { 
      executeSearch();
    }
  }

  const facetComponents = facets
    .filter(facet => facet.options?.length > 0)
    .map(facet => {
      const config = facetConfigs?.[facet.fieldId] ?? {};
      return <Facet
        key={facet.fieldId}
        facet={facet}
        {...config}
        searchable={searchable}
        collapsible={collapsible}
        defaultExpanded={defaultExpanded}
        onToggle={handleFacetOptionChange} />
    });

  return (
    <div className='Facets'>
      <div className='Facets__options'>
        {facetComponents}
      </div>
      <div className='Facets__controls'>
        {!searchOnChange && <button className='Facets__button' onClick={executeSearch}>Apply</button>}
        <button className='Facets__link' onClick={handleResetFacets}>Reset all</button>
      </div>
    </div>
  )
}
