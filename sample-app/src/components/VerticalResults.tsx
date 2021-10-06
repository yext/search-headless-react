import { CardComponent, CardConfigTypes } from '../models/cardComponent';
import { Result } from '@yext/answers-core';
import classNames from 'classnames';
import '../sass/VerticalResults.scss';
import { useAnswersState } from '@yext/answers-headless-react';
import subscribeToAnswersUpdates from './utils/subscribeToAnswersUpdates';

interface VerticalResultsProps {
  CardComponent: CardComponent,
  cardConfig?: CardConfigTypes,
  results: Result[]
}

/**
 * A Component that displays all the search results for a given vertical.
 * 
 * @param props - The props for the Component, including the results and the card type
 *                to be used.
 */
export function VerticalResultsDisplay(props: VerticalResultsProps): JSX.Element | null {
  const { CardComponent, results, cardConfig = {} } = props;
  const isLoading = useAnswersState(state => state.vertical.searchLoading);

  if (results.length === 0) {
    return null;
  }

  
  const resultsClasses = classNames("VerticalResults__results", {
    "VerticalResults__results--loading": isLoading,
  })

  return (
    <section className='VerticalResults'>
      <div className={resultsClasses}>
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


export default subscribeToAnswersUpdates<VerticalResultsProps, { displayAllResults?: boolean }>(
  VerticalResultsDisplay,
  props => {
    const { displayAllResults, ...modifiedProps } = props;
    const results = useAnswersState(state => state.vertical.results?.verticalResults.results) || [];
    const allResultsForVertical = 
      useAnswersState(state => state.vertical.results?.allResultsForVertical?.verticalResults.results) || [];
    modifiedProps.results = results?.length === 0 && displayAllResults
      ? allResultsForVertical
      : results
    return modifiedProps as VerticalResultsProps;
  }
);