import { useAnswersState } from "@yext/answers-headless-react";
import { VerticalConfig, SectionRegistry } from '../sectiontemplates/SectionRegistry'
import { DecoratedAppliedFiltersConfig } from "../components/DecoratedAppliedFilters";
import { VerticalResults } from "@yext/answers-core";

interface AppliedFiltersConfig extends DecoratedAppliedFiltersConfig {
  show: boolean
}

interface UniversalResultsProps {
  appliedFiltersConfig?: AppliedFiltersConfig,
  verticalConfigs: Record<string, VerticalConfig>
}

/**
 * A component that displays all the vertical results of a universal search.
 */
export default function UniversalResults({
  verticalConfigs,
  appliedFiltersConfig
}: UniversalResultsProps): JSX.Element | null {
  const allVerticalResults = useAnswersState(state => state?.universal?.results?.verticalResults) || [];

  if (allVerticalResults.length === 0) {
    return null;
  }

  return (
    <div className='UniversalResults'>
      {renderVerticalSections({allVerticalResults, appliedFiltersConfig, verticalConfigs})}
    </div>
  );
}

interface VerticalSectionsProps extends UniversalResultsProps {
  allVerticalResults: VerticalResults[]
}

/**
 * Renders a list of SectionComponent based on the given list of vertical results and corresponding configs,
 * including specifing what section template to use.
 */
function renderVerticalSections(props: VerticalSectionsProps): JSX.Element {
  const {allVerticalResults , appliedFiltersConfig, verticalConfigs} = props;
  return <>
  {allVerticalResults
    .filter(verticalResults => verticalResults.verticalKey in verticalConfigs && verticalResults.results)
    .map(verticalResults => {
      const verticalKey = verticalResults.verticalKey;
      const verticalConfig = verticalConfigs[verticalKey];

      const limit = verticalConfig.limit;
      const label = verticalConfig.label ?? verticalKey;
      const results = limit ? verticalResults.results.slice(0, limit) : verticalResults.results; 
      
      const SectionComponent = SectionRegistry[verticalConfig.sectionTemplate || 'StandardSection'];

      let appliedFilters;
      if (appliedFiltersConfig && appliedFiltersConfig.show) {
        const { show, ...filterConfigs } = appliedFiltersConfig;
        const appliedQueryFilters = verticalResults.appliedQueryFilters;
        appliedFilters = { ...filterConfigs, appliedQueryFilters }
      }

      return <SectionComponent
        results={results}
        resultsCount={verticalResults.resultsCount}
        verticalKey={verticalKey}
        verticalConfig={{...verticalConfig, label}}
        {...(appliedFilters && { appliedFilters })}
        key={verticalKey}
      />
    })}
  </>;
}
