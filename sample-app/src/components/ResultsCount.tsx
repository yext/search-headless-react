import { useAnswersState } from '@yext/answers-headless-react'

export default function ResultsCount() {
  const resultsCount = useAnswersState(state => state.vertical?.results?.verticalResults.resultsCount) || 0
  let resultsLength = useAnswersState(state => state.vertical?.results?.verticalResults.results.length) || 0
  const offset = useAnswersState(state => state.vertical?.offset) || 0

  const results = ((resultsLength === 0) ? "" : `${offset + 1}-${offset + resultsLength} of ${resultsCount}`)

  return (
    <div> {results} </div>
  )
}