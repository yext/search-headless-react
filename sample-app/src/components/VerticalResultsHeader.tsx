import { subscribeToStateUpdates } from "@yext/answers-headless-react";

interface ResultsHeaderProps {
  showResultsCount: boolean,
  resultsCount: number
}

/**
 * Renders information about the result set, such as applied query filters, result count, etc.
 * 
 * @param props - The configuration and data needed to render the header.
 */
function VerticalResultsHeader(props: ResultsHeaderProps): JSX.Element {
  const { showResultsCount, resultsCount } = props;
  return (
    <div className='yxt-ResultsHeader'>
      {showResultsCount && resultsCount && renderResultsCount(resultsCount)}
    </div>
  );
}

function renderResultsCount(count: number) {
  return (
    <div className='yxt-ResultsHeader-resultsCount'>
      {count}
    </div>
  );
}

export default subscribeToStateUpdates(state => {
  return { resultsCount: state.vertical.results?.verticalResults.resultsCount };
})(VerticalResultsHeader);