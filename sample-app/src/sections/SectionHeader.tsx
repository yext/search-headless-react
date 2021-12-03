import { Link } from "react-router-dom";
import { DecoratedAppliedFiltersDisplay, DecoratedAppliedFiltersConfig } from "../components/DecoratedAppliedFilters";
import { ResultsCountConfig } from "../components/ResultsCount";
import { useComposedCssClasses, CompositionMethod } from "../hooks/useComposedCssClasses";
import { ReactComponent as CollectionIcon } from '../icons/collection.svg';
import { useAnswersState } from '@yext/answers-headless-react';

interface SectionHeaderCssClasses {
  sectionHeaderContainer?: string,
  sectionHeaderIconContainer?: string,
  sectionHeaderLabel?: string,
  viewMoreContainer?: string,
  viewMoreLink?: string,
  appliedFiltersContainer?: string
}

const builtInCssClasses: SectionHeaderCssClasses = {
  sectionHeaderContainer: 'flex items-center w-full pl-1',
  sectionHeaderIconContainer: 'w-5 h-5',
  sectionHeaderLabel: 'font-semibold text-gray-800 text-base pl-3', 
  viewMoreContainer: 'flex justify-end flex-grow ml-auto font-medium text-gray-800',
  viewMoreLink: 'text-blue-600 text-sm pr-1 pl-3',
  appliedFiltersContainer: 'ml-3'
}

interface SectionHeaderConfig {
  label: string,
  resultsCountConfig?: ResultsCountConfig,
  appliedFiltersConfig?: DecoratedAppliedFiltersConfig,
  customCssClasses?: SectionHeaderCssClasses,
  cssCompositionMethod?: CompositionMethod,
  verticalKey: string,
  viewAllButton?: boolean
}

export default function SectionHeader(props: SectionHeaderConfig): JSX.Element {
  const { label, verticalKey, viewAllButton = false, appliedFiltersConfig, customCssClasses, cssCompositionMethod } = props;
  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses, cssCompositionMethod)
  const latestQuery = useAnswersState(state => state.query.mostRecentSearch); 
  return (
    <div className={cssClasses.sectionHeaderContainer}>
      <div className={cssClasses.sectionHeaderIconContainer}> 
        <CollectionIcon></CollectionIcon>
      </div>
      <h2 className={cssClasses.sectionHeaderLabel}>{label}</h2>
      {/* TODO (cea2aj): Add support for ResultsCountDisplay once we get the mocks from UX
        {resultsCountConfig &&
           <ResultsCountDisplay resultsLength={resultsCountConfig.resultsLength} resultsCount={resultsCountConfig.resultsCount} />} */}
      {appliedFiltersConfig &&
        <div className={cssClasses.appliedFiltersContainer}>
          <DecoratedAppliedFiltersDisplay {...appliedFiltersConfig}/>
        </div>}
      {viewAllButton && 
        <div className={cssClasses.viewMoreContainer}>
          <Link className={cssClasses.viewMoreLink} to={`/${verticalKey}?query=${latestQuery}`}>
            View all
          </Link>
        </div>}
    </div>
  );
}
