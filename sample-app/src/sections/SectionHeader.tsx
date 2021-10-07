import { DecoratedAppliedFiltersDisplay, DecoratedAppliedFiltersConfig } from "../components/DecoratedAppliedFilters";
import { ResultsCountDisplay, ResultsCountConfig } from "../components/ResultsCount";

interface SectionHeaderConfig {
  label: string,
  resultsCountConfig?: ResultsCountConfig,
  appliedFiltersConfig?: DecoratedAppliedFiltersConfig
}

export default function SectionHeader(props: SectionHeaderConfig): JSX.Element {
  const { label, resultsCountConfig, appliedFiltersConfig } = props;
  return <>
    <h2>{label}</h2>
    {resultsCountConfig &&
      <ResultsCountDisplay resultsLength={resultsCountConfig.resultsLength} resultsCount={resultsCountConfig.resultsCount} />}
    {appliedFiltersConfig && 
      <DecoratedAppliedFiltersDisplay {...appliedFiltersConfig}/>}
  </>;
}
