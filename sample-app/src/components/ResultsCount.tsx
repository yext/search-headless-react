import { useAnswersState } from '@yext/answers-headless-react'

export default function ResultsCount() {
  const vertical = useAnswersState(state => state.vertical);
  const resultsCount = vertical?.results?.verticalResults.resultsCount || 0
  let resultsLength = vertical?.results?.verticalResults.results.length || 0

  const offset = vertical?.offset || 0

  const results = ((resultsLength === 0) ? "#Results: none" : `#Results: ${offset + 1}-${offset + resultsLength} of ${resultsCount}`)

  return (
    <div> {results} </div>
  )
}