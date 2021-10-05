import { DecoratedAppliedFilters, DecoratedAppliedFiltersConfig } from "../components/DecoratedAppliedFilters";
import { ResultsCount, ResultsCountConfig } from "../components/ResultsCount";

interface SectionHeaderConfig {
  label: string,
  resultsCountConfig?: ResultsCountConfig,
  appliedFiltersConfig?: DecoratedAppliedFiltersConfig | undefined
}

export default function SectionHeader(props: SectionHeaderConfig): JSX.Element {
  const { label, resultsCountConfig, appliedFiltersConfig } = props;
  return <>
    <h2>{label}</h2>
    {resultsCountConfig &&
      <ResultsCount resultsLength={resultsCountConfig.resultsLength} resultsCount={resultsCountConfig.resultsCount} />}
    {appliedFiltersConfig && 
      <DecoratedAppliedFilters {...appliedFiltersConfig}/>}
  </>;
}
