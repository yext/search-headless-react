import { useAnswersState } from '@yext/answers-headless-react'


interface Props {
  resultsCount?: number,
  resultsLength?: number,
  offset?: number
}

export function ResultsCount(props: Props) {
  const resultsCount = props.resultsCount || 0;
  const resultsLength = props.resultsLength || 0;
  const offset = props.offset || 0;
  const results = ((resultsLength === 0) ? "" : `${offset + 1}-${offset + resultsLength} of ${resultsCount}`)

  return (
    <div> {results} </div>
  )
}

export function VerticalResultsCount() {
  const resultsCount = useAnswersState(state => state.vertical?.results?.verticalResults.resultsCount) || 0;
  const resultsLength = useAnswersState(state => state.vertical?.results?.verticalResults.results.length) || 0;
  const offset = useAnswersState(state => state.vertical?.offset) || 0;
  return <ResultsCount resultsCount={resultsCount} resultsLength={resultsLength} offset={offset}/>;
}
