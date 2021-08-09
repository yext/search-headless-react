import { useAnswersState } from '@yext/answers-headless-react';
import { CardComponent, CardConfigTypes } from '../models/cardComponent';
import { Result } from '@yext/answers-core';

interface Props {
  CardComponent: CardComponent,
  cardConfig: CardConfigTypes,
}

/**
 * A Component that displays all the search results for a given vertical.
 * 
 * @param props - The props for the Component, including the results and the card type
 *                to be used.
 */
export default function VerticalResults(props: Props): JSX.Element {
  const { CardComponent, cardConfig } = props;
  const results = useAnswersState(state => state.vertical.results?.verticalResults.results);

  return (
    <section className='yxt-Results'>
      <div className='yxt-Results-items'>
        {results && results.map(result => renderResult(CardComponent, cardConfig, result))}
      </div>
    </section>
  )
}

/**
 * Renders a single result using the specified card type and configuration.
 * 
 * @param CardComponent - The card for the vertical.
 * @param cardConfig - Any card-specific configuration.
 * @param result - The result to render.
 */
function renderResult(CardComponent: CardComponent, cardConfig: CardConfigTypes, result: Result): JSX.Element {
  return <CardComponent result={result} configuration={cardConfig} key={result.id}/>;
}
