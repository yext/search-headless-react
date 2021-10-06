import { subscribeToStateUpdates } from '@yext/answers-headless-react';
export interface ResultsCountConfig {
  resultsCount?: number,
  resultsLength?: number,
  offset?: number
}

export function ResultsCountDisplay(props: ResultsCountConfig): JSX.Element {
  const resultsCount = props.resultsCount || 0;
  const resultsLength = props.resultsLength || 0;
  const offset = props.offset || 0;
  const results = ((resultsLength === 0) ? "" : `${offset + 1}-${offset + resultsLength} of ${resultsCount}`)

  return (
    <div> {results} </div>
  )
}

export default subscribeToStateUpdates(state => {
  return {
    resultsCount: state.vertical?.results?.verticalResults.resultsCount,
    resultsLength: state.vertical?.results?.verticalResults.results.length,
    offset: state.vertical?.offset
  };
})(ResultsCountDisplay)