import { CompositionMethod, useComposedCssClasses } from '../../hooks/useComposedCssClasses';
import { CardProps } from '../../models/cardComponent';

export interface StandardCardConfig {
  showOrdinal?: boolean
}

export interface StandardCardProps extends CardProps {
  configuration: StandardCardConfig,
  customCssClasses?: StandardCardCssClasses,
  compositionMethod?: CompositionMethod
}

export interface StandardCardCssClasses {
  container?: string,
  header?: string,
  body?: string,
  descriptionContainer?: string,
  ctaContainer?: string,
  cta1?: string,
  cta2?: string,
  ordinal?: string,
  title?: string
}

const builtInCssClasses: StandardCardCssClasses = {
  container: 'StandardCard flex flex-col justify-between border rounded-lg mt-4 p-4',
  header: 'flex text-gray-800',
  body: 'flex justify-end pt-2.5',
  descriptionContainer: 'w-full text-base',
  ctaContainer: 'flex flex-col justify-end ml-4',
  cta1: 'min-w-max bg-blue-600 text-white font-medium rounded-lg py-2 px-5',
  cta2: 'min-w-max bg-white text-blue-600 font-medium rounded-lg py-2 px-5 mt-2 border',
  ordinal: 'mr-1.5 text-lg font-medium',
  title: 'text-lg font-medium'
}

interface CtaData { 
  label: string,
  link: string,
  linkType: string
}

/**
 * This Component renders the base result card.
 * 
 * @param props - An object containing the result itself.
 */
export function StandardCard(props: StandardCardProps): JSX.Element {
  const { configuration, result, customCssClasses, compositionMethod } = props;
  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses, compositionMethod);

  const cta1 = result.rawData.c_primaryCTA as CtaData;
  const cta2 = result.rawData.c_secondaryCTA as CtaData;

  // TODO (cea2aj) We need to handle the various linkType so these CTAs are clickable
  function renderCTAs(cta1?: CtaData, cta2?: CtaData) {
    return (<>
      {(cta1 ?? cta2) && 
        <div className={cssClasses.ctaContainer}>
          {cta1 && renderFirstCTA(cta1)}
          {cta2 && renderSecondCTA(cta2)}
        </div>
      }
    </>);
  }

  function renderFirstCTA({ label, link, linkType }: CtaData) {
    return (
      <button className={cssClasses.cta1}>{label}</button>
    )
  }

  function renderSecondCTA({ label, link, linkType }: CtaData) {
    return (
      <button className={cssClasses.cta2}>{label}</button>
    )
  }

  function renderOrdinal(ordinal: number) {
    return (
      <div className={cssClasses.ordinal}>
        {ordinal} -
      </div>
    );
  }

  function renderTitle(title: string) {
    return <div className={cssClasses.title}>{title}</div>
  }

  return (
    <div className={cssClasses.container}>
      <div className={cssClasses.header}>
        {configuration.showOrdinal && result.index && renderOrdinal(result.index)}
        {result.name && renderTitle(result.name)}
      </div>
      {(result.description ?? cta1 ?? cta2) &&
        <div className={cssClasses.body}>
          <div className={cssClasses.descriptionContainer}> 
            <span>{result.description}</span>
          </div>
          {renderCTAs(cta1, cta2)}
        </div>
      }
    </div>
  );
}