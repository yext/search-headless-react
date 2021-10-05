import { VerticalResults } from "../components/VerticalResults";
import { Link } from "react-router-dom";
import { useAnswersState } from "@yext/answers-headless-react";
import { SectionConfig } from "../models/sectionComponent";
import { StandardCard } from "../components/cards/StandardCard";

export default function StandardSection(props: SectionConfig): JSX.Element | null {
  const { results, verticalKey, cardConfig, viewMore, header } = props;
  const latestQuery = useAnswersState(state => state.query.latest); 
  if (results.length === 0) {
    return null;
  }
  const cardComponent = cardConfig?.CardComponent || StandardCard;
  
  return (
    <section className='StandardSection'>
      <div className='StandardSection__sectionHead'>
        {header}
      </div>
      <VerticalResults
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
