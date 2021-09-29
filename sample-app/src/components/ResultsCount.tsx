import { useAnswersState } from '@yext/answers-headless-react'


interface Props {
  resultsCount?: number,
  resultsLength?: number,
  offset?: number
}

export default function ResultsCount(props: Props) {
  let resultsCount = useAnswersState(state => state.vertical?.results?.verticalResults.resultsCount) || 0
  let resultsLength = useAnswersState(state => state.vertical?.results?.verticalResults.results.length) || 0
  let offset = useAnswersState(state => state.vertical?.offset) || 0
  
  if (Object.keys(props).length !== 0) {
    resultsCount = props.resultsCount || 0;
    resultsLength = props.resultsLength || 0;
    offset = props.offset || 0;
  }

  const results = ((resultsLength === 0) ? "" : `${offset + 1}-${offset + resultsLength} of ${resultsCount}`)

  return (
    <div> {results} </div>
  )
}
