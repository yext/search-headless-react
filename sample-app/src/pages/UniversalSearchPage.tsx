import UniversalResults from '../components/UniversalResults';
import { useLayoutEffect } from 'react';
import { useAnswersActions } from '@yext/answers-headless-react';
import '../sass/UniversalSearchPage.scss';
import { UniversalResultsConfig } from '../universalResultsConfig';

const universalResultsFilterConfig = {
  show: true
};

export default function UniversalSearchPage(props: { universalResultsConfig: UniversalResultsConfig}) {
  const { universalResultsConfig } = props;
  const answersActions = useAnswersActions();
  useLayoutEffect(() => {
    answersActions.setState({
      ...answersActions.state,
      vertical: {}
    })
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