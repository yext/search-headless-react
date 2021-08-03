import { Result } from '@yext/answers-core';
import { CardType } from '../models/cardTypes';
import { getComponentClassFromType } from './cards/cardRegistry';

/**
 * A Component that displays all the search results for a given vertical.
 * 
 * @param props - The props for the Component, including the results and the card type
 *                to be used.
 */
export default function VerticalResults(props: Props): JSX.Element {
  const { results, cardType } = props;

  return (
    <section className='yxt-Results'>
      <div className='yxt-Results-items'>
        {results && results.map(result => renderResult(cardType, result))}
      </div>
    </section>
  )
}

/**
 * Renders a single result using the specified card type.
 * 
 * @param cardType - The card type to use for the vertical.
 * @param result - The result to render.
 */
function renderResult(cardType: CardType, result: Result): JSX.Element {
  const CardComponent = getComponentClassFromType(cardType);

  return <CardComponent result={result} key={result.id}/>;
}

interface Props {
  cardType: CardType,
  results?: Result[]
}