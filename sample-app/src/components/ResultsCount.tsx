import withMapping from "./utils/withMapping";

export interface ResultsCountConfig {
  resultsCount?: number,
  resultsLength?: number,
  offset?: number
}

export function ResultsCount(props: ResultsCountConfig) {
  const resultsCount = props.resultsCount || 0;
  const resultsLength = props.resultsLength || 0;
  const offset = props.offset || 0;
  const results = ((resultsLength === 0) ? "" : `${offset + 1}-${offset + resultsLength} of ${resultsCount}`)

  return (
    <div> {results} </div>
  )
}

export const MappedResultsCount = withMapping(ResultsCount, {
  resultsCount: state => state.vertical?.results?.verticalResults.resultsCount,
  resultsLength: state => state.vertical?.results?.verticalResults.results.length,
  offset: state => state.vertical?.offset
});
