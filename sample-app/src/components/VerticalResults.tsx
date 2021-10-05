import { CardComponent, CardConfigTypes } from '../models/cardComponent';
import { Result } from '@yext/answers-core';
import withPropsMapping from './utils/withPropsMapping';
import classNames from 'classnames';
import '../sass/VerticalResults.scss';
import { useAnswersState } from '@yext/answers-headless-react'
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


export default withPropsMapping<VerticalResultsWithMapping>(
  VerticalResultsDisplay, {
    results: state => state.vertical.results?.verticalResults.results || [],
    allResultsForVertical: state => state.vertical.results?.allResultsForVertical?.verticalResults.results || []
  },
  props => {
    props.results = props.results?.length === 0 && props.displayAllResults
      ? props.allResultsForVertical
      : props.results
  }
);