import { VerticalResultsDisplay } from "../components/VerticalResults";
import { Link } from "react-router-dom";
import { useAnswersState } from "@yext/answers-headless-react";
import { SectionComponent, SectionConfig } from "../models/sectionComponent";
import { StandardCard } from "../components/cards/StandardCard";

const StandardSection: SectionComponent = function (props: SectionConfig): JSX.Element | null {
  const { results, verticalKey, cardConfig, viewMore, header } = props;
  const latestQuery = useAnswersState(state => state.query.mostRecentSearch); 
  if (results.length === 0) {
    return null;
  }
  const cardComponent = cardConfig?.CardComponent || StandardCard;
  
  return (
    <section className='StandardSection'>
      <div className='StandardSection__sectionHead'>
        {header}
      </div>
      <VerticalResultsDisplay
        results={results}
        CardComponent={cardComponent}
        {...(cardConfig && { cardConfig })}
      />
      {viewMore && 
        <Link className='StandardSection__sectionLink' to={`/${verticalKey}?query=${latestQuery}`}>
          View all
        </Link>}
    </section>
  );
}
export default StandardSection;