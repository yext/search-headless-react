import { useAnswersState } from '@yext/answers-headless-react';
import { CardComponent, CardConfigTypes } from '../models/cardComponent';
import { Result } from '@yext/answers-core';

interface VerticalResultsProps {
  CardComponent: CardComponent,
  cardConfig?: CardConfigTypes,
  results: Result[]
}

interface VerticalResultsWithMappingProps extends Omit<VerticalResultsProps, 'results'> {
  displayAllResults?: boolean
}

/**
 * A Component that displays all the search results for a given vertical.
 * 
 * @param props - The props for the Component, including the results and the card type
 *                to be used.
 */
export function VerticalResults(props: VerticalResultsProps): JSX.Element | null {
  const { CardComponent, results, cardConfig = {} } = props;

  if (results.length === 0) {
    return null;
  }

  return (
    <section className='VerticalResults'>
      <div className='VerticalResults__results'>
        {results && results.map(result => renderResult(CardComponent, cardConfig, result))}
      </div>
    </section>
  )
}

export function VerticalResultsWithMapping(props: VerticalResultsWithMappingProps): JSX.Element | null {
  const { displayAllResults = true, ...otherProps } = props;

  const verticalResults = useAnswersState(state => state.vertical.results?.verticalResults.results) || [];
  const allResultsForVertical = useAnswersState(state => state.vertical.results?.allResultsForVertical?.verticalResults.results) || [];
  
  const results = verticalResults.length === 0 && displayAllResults
    ? allResultsForVertical
    : verticalResults

  return <VerticalResults results={results} {...otherProps}/>
}

/**
 * Renders a single result using the specified card type and configuration.
 * 
 * @param CardComponent - The card for the vertical.
 * @param cardConfig - Any card-specific configuration.
 * @param result - The result to render.
 */
function renderResult(CardComponent: CardComponent, cardConfig: CardConfigTypes, result: Result): JSX.Element {
  return <CardComponent result={result} configuration={cardConfig} key={result.id || result.index}/>;
}
