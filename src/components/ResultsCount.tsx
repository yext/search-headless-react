import { listenToStatefulCore } from '../bindings/listenToStatefulCore'

interface Props {
  count: number
}

function ResultsCount({ count }: Props) {
  return (
    <div> #Results - {count || 0} </div>
  )
}

export default listenToStatefulCore(state => {
  return {
    count: state.vertical.results?.verticalResults.resultsCount
  }
})(ResultsCount)