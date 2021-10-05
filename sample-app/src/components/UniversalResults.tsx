import { useAnswersState } from "@yext/answers-headless-react";
import { VerticalConfig } from "../models/sectionComponent";
import { VerticalResults } from "@yext/answers-core";
import StandardSection from "../sections/StandardSection";
import { ResultsCount, ResultsCountConfig } from '../components/ResultsCount';
import { DecoratedAppliedFilters, DecoratedAppliedFiltersConfig } from '../components/DecoratedAppliedFilters';

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
  const { resultsFromAllVerticals, verticalConfigs } = props;
  return <>
    {resultsFromAllVerticals
      .filter(verticalResults => verticalResults.results)
      .map(verticalResults => {
        const verticalKey = verticalResults.verticalKey;
        const verticalConfig = verticalConfigs[verticalKey] || {};

        const label = verticalConfig.label ?? verticalKey;
        const results = verticalResults.results; 
        
        const SectionComponent = verticalConfig.SectionComponent || StandardSection;

        const { show, ...filterconfig } = props.appliedFiltersConfig || {};
        const appliedFiltersConfig = show
          ? { ...filterconfig, appliedQueryFilters: verticalResults.appliedQueryFilters }
          : undefined;

        const resultsCountConfig = { 
          resultsCount: verticalResults.resultsCount,
          resultsLength: results.length
        };

        return <SectionComponent
          results={results}
          verticalKey={verticalKey}
          header={renderSectionHeader({ label, resultsCountConfig, appliedFiltersConfig })}
          cardConfig={verticalConfig.cardConfig}
          viewMore={verticalConfig.viewMore}
          key={verticalKey}
        />
      })
    }
  </>;
}

interface SectionHeaderConfig {
  label: string,
  resultsCountConfig: ResultsCountConfig,
  appliedFiltersConfig: DecoratedAppliedFiltersConfig | undefined
}

function renderSectionHeader(props: SectionHeaderConfig): JSX.Element {
  const { label, resultsCountConfig, appliedFiltersConfig } = props;
  return <>
    <h2>{label}</h2>
    <ResultsCount resultsLength={resultsCountConfig.resultsLength} resultsCount={resultsCountConfig.resultsCount} />
    {appliedFiltersConfig && <DecoratedAppliedFilters {...appliedFiltersConfig}/>}
  </>;
}