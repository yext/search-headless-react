import { useAnswersState, useAnswersActions } from '@yext/answers-headless-react'
import { DisplayableFacet, DisplayableFacetOption } from "@yext/answers-core";
import Facet, { FacetTextConfig, FacetBehaviorConfig, onFacetChangeFn } from './Facet';
import '../sass/Facets.scss';


type FacetFieldConfig = FacetTextConfig & Pick<FacetBehaviorConfig, 'searchable'>;

interface FacetsProps {
  searchOnChange?: boolean,
  searchable?: boolean,
  collapsible?: boolean
  defaultExpanded?: boolean
  facetConfigs?: Record<string, FacetFieldConfig>
}

export default function Facets (props: FacetsProps): JSX.Element {
  const { searchOnChange, searchable, collapsible, defaultExpanded, facetConfigs = {} } = props;
  const facets = useAnswersState(state => state.filters?.facets) || [];
  if(searchable) {
    facets.forEach(facet => facetConfigs[facet.fieldId] = Object.assign({ searchable }, facetConfigs[facet.fieldId]));
  }

  const answersActions = useAnswersActions();
  const executeSearch = () => answersActions.executeVerticalQuery();

  const handleResetFacets = () => {
    answersActions.resetFacets();
    if (searchOnChange) { 
      answersActions.executeVerticalQuery();
    }
  }

  const handleFacetOptionChange = (fieldId: string, option: DisplayableFacetOption) => {
    option.selected
      ?  answersActions.unselectFacetOption(fieldId, option)
      :  answersActions.selectFacetOption(fieldId, option);
    
    if (searchOnChange) { 
      answersActions.executeVerticalQuery();
    }
  }

  return (
    <div className='Facets'>
      <div className='Facets__options'>
        {renderFacets({facets, facetConfigs, collapsible, defaultExpanded, handleFacetOptionChange})}
      </div>
      <div className='Facets__controls'>
        {!searchOnChange && <button className={`Facets__button`} onClick={executeSearch}>Apply</button>}
        <button className={`Facets__link`} onClick={handleResetFacets}>Reset all</button>
      </div>
    </div>
  )
}

interface RenderFacetsProps extends FacetsProps {
  facets: DisplayableFacet[]
  handleFacetOptionChange: onFacetChangeFn
}

function renderFacets(props: RenderFacetsProps): JSX.Element {
  const { facets, facetConfigs, collapsible, defaultExpanded, handleFacetOptionChange } = props;
  return <>
    {facets
      .filter(facet => facet.options?.length > 0)
      .map(facet => {
        const config = facetConfigs?.[facet.fieldId] ?? {};
        return <Facet
        key={facet.fieldId}
        facet={facet}
        {...config}
        collapsible={collapsible}
        defaultExpanded={defaultExpanded}
        onToggle={handleFacetOptionChange} />
      })
    }
  </>
}
