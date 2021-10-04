import VerticalResults from "../components/VerticalResults";
import { Link } from "react-router-dom";
import { useAnswersState } from "@yext/answers-headless-react";
import { DecoratedAppliedFilters } from "../components/DecoratedAppliedFilters";
import { ResultsCount } from "../components/ResultsCount";
import { SectionConfig } from "../models/sectionComponent";
import { StandardCard } from "../components/cards/StandardCard";

export default function StandardSection(props: SectionConfig): JSX.Element | null {
  const { results, verticalKey, verticalConfig, appliedFilters, resultsCount } = props;
  const latestQuery = useAnswersState(state => state.query.latest);
  
  if (results.length === 0) {
    return null;
  }

  const resultsLength = verticalConfig.limit
    ? Math.min(verticalConfig.limit, results.length)
    : results.length;
  const cardComponent = verticalConfig.cardConfig?.CardComponent || StandardCard;
  
  return (
    <section className='StandardSection'>
      <div className='StandardSection__sectionHead'>
        <h2 className='StandardSection__sectionLabel'>{verticalConfig.label}</h2>
        <ResultsCount resultsLength={resultsLength} resultsCount={resultsCount} />
        {appliedFilters && <DecoratedAppliedFilters {...appliedFilters}/>}
      </div>
      <VerticalResults
        results={results}
        CardComponent={cardComponent}
        cardConfig={verticalConfig.cardConfig || {} }
      />
      {verticalConfig.viewMore && 
        <Link className='StandardSection__sectionLink' to={`/${verticalKey}?query=${latestQuery}`}>
          View all
        </Link>}
    </section>
  );
}
