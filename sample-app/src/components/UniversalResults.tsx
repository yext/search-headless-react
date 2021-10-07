import { useAnswersState } from "@yext/answers-headless-react";
import { VerticalConfig } from "../models/sectionComponent";
import { VerticalResults } from "@yext/answers-core";
import StandardSection from "../sections/StandardSection";
import { DecoratedAppliedFiltersConfig } from '../components/DecoratedAppliedFilters';
import SectionHeader from "../sections/SectionHeader";
import classNames from "classnames";

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
  const isLoading = useAnswersState(state => state.universal.searchLoading);

  if (resultsFromAllVerticals.length === 0) {
    return null;
  }

  const resultsClassNames = classNames('UniversalResults', { 'loading-state': isLoading });

  return (
    <div className={resultsClassNames}>
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
          header={<SectionHeader {...{ label, resultsCountConfig, appliedFiltersConfig }}/>}
          cardConfig={verticalConfig.cardConfig}
          viewMore={verticalConfig.viewMore}
          key={verticalKey}
        />
      })
    }
  </>;
}
