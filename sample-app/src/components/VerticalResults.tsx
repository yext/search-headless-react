import { CardComponent, CardConfigTypes } from '../models/cardComponent';
import { Result } from '@yext/answers-core';
import withMapping from './utils/withMapping';

interface VerticalResultsProps {
  CardComponent: CardComponent,
  cardConfig?: CardConfigTypes,
  results: Result[]
}

interface VerticalResultsWithMapping extends VerticalResultsProps {
  allResultsForVertical: Result[],
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


export const MappedVerticalResults = withMapping<VerticalResultsWithMapping>(
  VerticalResults, {
    results: state => state.vertical.results?.verticalResults.results || [],
    allResultsForVertical: state => state.vertical.results?.allResultsForVertical?.verticalResults.results || []
  },
  props => {
    props.results = props.results?.length === 0 && props.displayAllResults
      ? props.allResultsForVertical
      : props.results
  }
);