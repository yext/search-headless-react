import { VerticalResultsDisplay } from "../components/VerticalResults";
import { SectionComponent, SectionConfig } from "../models/sectionComponent";
import { StandardCard } from "../components/cards/StandardCard";
import { CompositionMethod, useComposedCssClasses } from "../hooks/useComposedCssClasses";

interface StandardSectionCssClasses {
  section?: string
}

const builtInCssClasses: StandardSectionCssClasses = {
  section: ''
}

interface StandardSectionConfig extends SectionConfig {
  customCssClasses?: StandardSectionCssClasses,
  compositionmethod?: CompositionMethod
}

const StandardSection: SectionComponent = function (props: StandardSectionConfig): JSX.Element | null {
  const cssClasses = useComposedCssClasses(builtInCssClasses, props.customCssClasses, props.compositionmethod )
  const { results,  cardConfig, header } = props;
  
  if (results.length === 0) {
    return null;
  }
  const cardComponent = cardConfig?.CardComponent || StandardCard;
  
  return (
    <section className={cssClasses.section}>
      {header}
      <VerticalResultsDisplay
        results={results}
        CardComponent={cardComponent}
        {...(cardConfig && { cardConfig })}
      />
    </section>
  );
}
export default StandardSection;