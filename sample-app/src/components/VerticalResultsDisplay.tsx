import { useAnswersState } from '@yext/answers-headless-react';

interface Props {
  randomString: string
}

export default function VerticalResultsDisplay({ randomString }: Props) {
  const results = useAnswersState(state => state.vertical.results?.verticalResults.results);

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