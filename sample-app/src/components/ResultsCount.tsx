import { subscribeToStateUpdates } from '@yext/answers-headless-react'

interface Props {
  count: number
}

function ResultsCount({ count }: Props) {
  return (
    <div> #Results - {count || 0} </div>
  )
}

export default subscribeToStateUpdates(state => {
  return {
    count: state.vertical.results?.verticalResults.resultsCount
  }
})(ResultsCount)