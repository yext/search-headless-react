import VerticalResults from "../components/VerticalResults";
import { Link } from "react-router-dom";
import { SectionConfig } from "./SectionRegistry";
import { useAnswersState } from "@yext/answers-headless-react";
import { CardRegistry } from "../components/cards/CardRegistry";
import DecoratedAppliedFilters from "../components/DecoratedAppliedFilters";
import ResultsCount from "../components/ResultsCount";

export default function StandardSection(props: SectionConfig): JSX.Element | null {
  const { results, verticalKey, verticalConfig, appliedFilters, resultsCount } = props;
  const latestQuery = useAnswersState(state => state.query.latest);
  
  if (results.length === 0) {
    return null;
  }

  const cardType = verticalConfig.cardConfig?.cardType || 'StandardCard'
  const cardComponent = CardRegistry[cardType];
  
  return (
    <section className={'StandardSection'}>
      <div className={'StandardSection__sectionHead'}>
        <h2 className={'StandardSection__sectionLabel'}>{verticalConfig.label}</h2>
        <ResultsCount resultsLength={verticalConfig.limit? verticalConfig.limit: results.length} 
          resultsCount={resultsCount} />
        {appliedFilters && <DecoratedAppliedFilters {...appliedFilters}/>}
      </div>
      <VerticalResults
        results={results}
        CardComponent={cardComponent}
        cardConfig={verticalConfig.cardConfig || {}}
      />
      {verticalConfig.viewMore && 
        <Link className='StandardSection__sectionLink' to={`/${verticalKey}?query=${latestQuery}`}>
          View all
        </Link>}
    </section>
  );
}
