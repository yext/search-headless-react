import { useAnswersState } from '@yext/answers-headless-react';
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


export default function ResultsCount() {
  const resultsCount = useAnswersState(state => state.vertical?.resultsCount) || 0;
  const resultsLength = useAnswersState(state => state.vertical?.results?.length) || 0;
  const offset = useAnswersState(state => state.vertical?.offset) || 0;
  return <ResultsCountDisplay resultsCount={resultsCount} resultsLength={resultsLength} offset={offset}/>;
}
