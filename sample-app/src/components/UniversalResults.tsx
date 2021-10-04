import { useAnswersState } from "@yext/answers-headless-react";
import { DecoratedAppliedFiltersConfig } from "../components/DecoratedAppliedFilters";
import { VerticalConfig } from "../models/sectionComponent";
import { VerticalResults } from "@yext/answers-core";
import StandardSection from "../sectiontemplates/StandardSection";

interface AppliedFiltersConfig extends Omit<DecoratedAppliedFiltersConfig, 'appliedQueryFilters'> {
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
  const resultsFromAllVerticals = useAnswersState(state => state?.universal?.results?.verticalResults) || [];

  if (resultsFromAllVerticals.length === 0) {
    return null;
  }

  return (
    <div className='UniversalResults'>
      {renderVerticalSections({ resultsFromAllVerticals, appliedFiltersConfig, verticalConfigs })}
    </div>
  );
}

interface VerticalSectionsProps extends UniversalResultsProps {
  resultsFromAllVerticals: VerticalResults[]
}

/**
 * Renders a list of SectionComponent based on the given list of vertical results and corresponding configs,
 * including specifing what section template to use.
 */
function renderVerticalSections(props: VerticalSectionsProps): JSX.Element {
  const { resultsFromAllVerticals , appliedFiltersConfig, verticalConfigs } = props;
  return <>
    {resultsFromAllVerticals
      .filter(verticalResults => verticalResults.results)
      .map(verticalResults => {
        const verticalKey = verticalResults.verticalKey;
        const verticalConfig = verticalConfigs[verticalKey] || {};

        const limit = verticalConfig.limit;
        const label = verticalConfig.label ?? verticalKey;
        const results = limit ? verticalResults.results.slice(0, limit) : verticalResults.results; 
        
        const SectionComponent = verticalConfig.SectionComponent || StandardSection;

        const { show, ...filterconfig } = appliedFiltersConfig || {};
        const appliedFilters = show
          ? { ...filterconfig, appliedQueryFilters: verticalResults.appliedQueryFilters }
          : undefined;


        return <SectionComponent
          results={results}
          resultsCount={verticalResults.resultsCount}
          verticalKey={verticalKey}
          verticalConfig={{ ...verticalConfig, label }}
          {...(appliedFilters && { appliedFilters })}
          key={verticalKey}
        />
      })
    }
  </>;
}
