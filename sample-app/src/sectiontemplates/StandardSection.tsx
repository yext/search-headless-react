import VerticalResults from "../components/VerticalResults";
import { Link } from "react-router-dom";
import { SectionTemplateConfig } from "./SectionTemplateRegistry";
import { useAnswersState } from "@yext/answers-headless-react";
import { CardRegistry } from "../components/cards/CardRegistry";
import DecoratedAppliedFilters from "../components/DecoratedAppliedFilters";

export default function StandardSection(props: SectionTemplateConfig): JSX.Element | null {
  const { results, verticalKey, verticalConfig, appliedFilters } = props;
  const latestQuery = useAnswersState(state => state.query.latest);
  
  if(results.length === 0) {
    return null;
  }

  const cardType = verticalConfig.cardConfig?.cardType || 'StandardCard'
  const cardComponent = CardRegistry[cardType];
  
  return (
    <section className={"UniversalResults__section"}>
      <div className={"UniversalResults__sectionHead"}>
        <h2 className={"UniversalResults__sectionLabel"}>{verticalConfig.label}</h2>
        {appliedFilters && <DecoratedAppliedFilters {...appliedFilters}/>}
      </div>
      {/* TODO: add map rendering ability*/}
      <VerticalResults
        results={results}
        CardComponent={cardComponent}
        cardConfig={verticalConfig.cardConfig || {}}
      />
      {verticalConfig.viewMore && 
        <Link className="UniversalResults__sectionLink" to={`/${verticalKey}?query=${latestQuery}`}>
          View all
        </Link>}
    </section>
  );
}
