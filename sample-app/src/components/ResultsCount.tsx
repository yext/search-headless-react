import { useAnswersState } from '@yext/answers-headless-react';
import subscribeToAnswersUpdates from './utils/subscribeToAnswersUpdates';

export interface ResultsCountConfig {
  resultsCount?: number,
  resultsLength?: number,
  offset?: number
}

export function ResultsCountDisplay(props: ResultsCountConfig) {
  const resultsCount = props.resultsCount || 0;
  const resultsLength = props.resultsLength || 0;
  const offset = props.offset || 0;
  const results = ((resultsLength === 0) ? "" : `${offset + 1}-${offset + resultsLength} of ${resultsCount}`)

  return (
    <div> {results} </div>
  )
}

export default subscribeToAnswersUpdates(ResultsCountDisplay, props => {
  const { ...modifiedProps } = props;
  modifiedProps.resultsCount = useAnswersState(state => state.vertical?.results?.verticalResults.resultsCount);
  modifiedProps.resultsLength = useAnswersState(state => state.vertical?.results?.verticalResults.results.length);
  modifiedProps.offset = useAnswersState(state => state.vertical?.offset);
  return modifiedProps;
});
