import UniversalResults, { VerticalConfig } from '../components/UniversalResults';
import { useLayoutEffect } from 'react';
import { useAnswersActions } from '@yext/answers-headless-react';

const universalResultsFilterConfig = {
  show: true
};

export default function UniversalSearchPage(props: { universalResultsConfig: Record<string, VerticalConfig>}) {
  const { universalResultsConfig } = props;
  const answersActions = useAnswersActions();
  useLayoutEffect(() => {
    answersActions.setVerticalKey('');
    answersActions.executeUniversalQuery();
  }, [answersActions]);
  return (
    <div className='UniversalSearchPage'>
      <UniversalResults
        appliedFiltersConfig={universalResultsFilterConfig}
        verticalConfigs={universalResultsConfig}
      />
    </div>
  )
}