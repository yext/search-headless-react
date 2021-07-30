import { Result } from '@yext/answers-core';
import { listenToStatefulCore } from '../bindings/listenToStatefulCore';

interface Props {
  results: Result[],
  randomString: string
}
function VerticalResultsDisplay({ results, randomString }: Props) {
  return (
    <div>
      my special random string: {randomString}
      {
        results && results.length !== 0 ? results.map(result => {
          return (
            <div className='result' key={result.id}>
              <div className='result-name'>
                name: {result.name}
              </div>
              <div className='result-description'>
                desc: {result.description}
              </div>
            </div>
          )
        }) : null
      }
    </div>
  )
}

export default listenToStatefulCore(state => {
  return {
    results: state.vertical.results?.verticalResults.results,
  };
})(VerticalResultsDisplay)