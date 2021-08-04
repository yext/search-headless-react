import { Result } from '@yext/answers-core';
import { CardType } from '../models/cardTypes';
import { CardConfigTypes, getComponentClassFromType } from './cards/cardRegistry';

/**
 * A Component that displays all the search results for a given vertical.
 * 
 * @param props - The props for the Component, including the results and the card type
 *                to be used.
 */
export default function VerticalResults(props: Props): JSX.Element {
  const { results, cardType, cardConfig } = props;

  return (
    <section className='yxt-Results'>
      <div className='yxt-Results-items'>
        {results && results.map(result => renderResult(cardType, cardConfig, result))}
      </div>
    </section>
  )
}

/**
 * Renders a single result using the specified card type and configuration.
 * 
 * @param cardType - The card type to use for the vertical.
 * @param cardConfig - Any card-specific configuration.
 * @param result - The result to render.
 */
function renderResult(cardType: CardType, cardConfig: CardConfigTypes, result: Result): JSX.Element {
  const CardComponent = getComponentClassFromType(cardType);

  return <CardComponent result={result} configuration={cardConfig} key={result.id}/>;
}

interface Props {
  cardType: CardType,
  cardConfig: CardConfigTypes,
  results?: Result[]
}