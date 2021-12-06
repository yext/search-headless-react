import { useAnswersState, VerticalResults } from "@yext/answers-headless-react";
import StandardSection from "../sections/StandardSection";
import { AppliedFiltersProps } from '../components/AppliedFilters';
import SectionHeader from "../sections/SectionHeader";
import { SectionComponent } from "../models/sectionComponent";
import { CardConfig } from '../models/cardComponent';
import { useComposedCssClasses, CompositionMethod } from "../hooks/useComposedCssClasses";
import classNames from "classnames";

interface UniversalResultsCssClasses {
  container?: string,
  results___loading?: string
}

const builtInCssClasses: UniversalResultsCssClasses = {
  container: 'space-y-8 mt-6',
  results___loading: 'opacity-50'
}

export interface VerticalConfig {
  SectionComponent?: SectionComponent,
  cardConfig?: CardConfig,
  label?: string,
  viewAllButton?: boolean
}

interface AppliedFiltersConfig extends Omit<AppliedFiltersProps, 'appliedQueryFilters'> {
  show: boolean
}

interface UniversalResultsProps {
  appliedFiltersConfig?: AppliedFiltersConfig,
  verticalConfigs: Record<string, VerticalConfig>,
  customCssClasses?: UniversalResultsCssClasses,
  cssCompositionMethod?: CompositionMethod
}

/**
 * A component that displays all the vertical results of a universal search.
 */
export default function UniversalResults({
  verticalConfigs,
  appliedFiltersConfig,
  customCssClasses,
  cssCompositionMethod
}: UniversalResultsProps): JSX.Element | null {
  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses, cssCompositionMethod)
  const resultsFromAllVerticals = useAnswersState(state => state?.universal?.verticals) || [];
  const isLoading = useAnswersState(state => state.searchStatus.isLoading);

  if (resultsFromAllVerticals.length === 0) {
    return null;
  }

  const resultsClassNames = cssClasses.results___loading
    ? classNames(cssClasses.container, { [cssClasses.results___loading]: isLoading })
    : cssClasses.container;

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
          header={<SectionHeader {...{ 
            label, 
            resultsCountConfig,
            appliedFiltersConfig,
            verticalKey,
            viewAllButton: verticalConfig.viewAllButton 
          }}/>}
          cardConfig={verticalConfig.cardConfig}
          key={verticalKey}
        />
      })
    }
  </>;
}
