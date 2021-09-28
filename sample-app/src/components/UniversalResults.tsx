import { useAnswersState } from "@yext/answers-headless-react";
import { State } from "@yext/answers-headless/lib/esm/models/state";
import { VerticalConfig, SectionTemplateRegistry } from '../sectiontemplates/SectionTemplateRegistry'
import { DecoratedAppliedFiltersConfig } from "./DecoratedAppliedFilters";

interface AppliedFiltersConfig extends Omit<DecoratedAppliedFiltersConfig, 'mapStateToAppliedQueryFilters'>{
  show: boolean
}

interface Props {
  appliedFilters?: AppliedFiltersConfig,
  verticalConfigs: Record<string, VerticalConfig>
}

/**
 * A Component that displays all the search results for a universal search.
 */
export default function UniversalResults({
  verticalConfigs,
  appliedFilters
}: Props): JSX.Element | null {
  const allVerticalResults = useAnswersState(state => state?.universal?.results?.verticalResults) || [];
  const isLoading = useAnswersState(state => state.universal.searchLoading);

  if (allVerticalResults.length === 0) {
    return null;
  }

  return (
    <div className={`UniversalResults ${isLoading ? 'isLoading' : ''}`}>
      {/* TODO: add direct answer component <DirectAnswer /> */}
      {allVerticalResults
        .map((verticalResults, index) => {
          if( !(verticalResults.verticalKey in verticalConfigs) || !verticalResults.results) {
            return null;
          }

          const verticalKey = verticalResults.verticalKey;
          const verticalConfig = verticalConfigs[verticalKey];

          const limit = verticalConfig.limit;
          const label = verticalConfig.label ?? verticalKey;
          const results = limit ? verticalResults.results.slice(0, limit) : verticalResults.results; 
          
          const SectionComponent = SectionTemplateRegistry[verticalConfig.sectionTemplate || 'StandardSection'];
          let decoratedAppliedFilters;
          if (appliedFilters && appliedFilters.show) {
            const { show, ...filterConfigs } = appliedFilters;
            const mapStateToAppliedQueryFilters = (state: State) => state?.universal?.results?.verticalResults[index].appliedQueryFilters;
            decoratedAppliedFilters = { ...filterConfigs, mapStateToAppliedQueryFilters }
          }

          return (
            <SectionComponent 
              results={results} 
              verticalConfig={{...verticalConfig, label}}
              verticalKey={verticalKey}
              {...(decoratedAppliedFilters && { appliedFilters: decoratedAppliedFilters })}
              key={verticalKey}
            />
          );
        })
        .filter(component => component)
      }
    </div>
  );
}
