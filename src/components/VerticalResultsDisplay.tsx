import { Result } from '@yext/answers-core';
import { listenToStatefulCore } from '../bindings/listenToStatefulCore';

interface Props {
  results: Result[],
  randomString: string
}
function VerticalResultsDisplay({ results, randomString }: Props) {
  return (
    <div>
      {
        results && results.map(result => {
          return (
            <div className='result' key={result.id}>
              {randomString}
              <div className='result-name'>
                name: {result.name}
              </div>
              <div className='result-description'>
                desc: {result.description}
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default listenToStatefulCore(state => {
  console.log('state listener for vresults!', state)
  return {
    results: state.vertical.results?.verticalResults.results
  };
})(VerticalResultsDisplay)