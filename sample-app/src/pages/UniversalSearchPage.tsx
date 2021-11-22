import UniversalResults from '../components/UniversalResults';
import { useLayoutEffect } from 'react';
import { useAnswersActions } from '@yext/answers-headless-react';
import { SearchIntent } from '@yext/answers-headless';
import '../sass/UniversalSearchPage.scss';
import { UniversalResultsConfig } from '../universalResultsConfig';
import { executeSearchWithIntents, getSearchIntents } from '../utils/search-operations';

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
    const executeQuery = async () => {
      let searchIntents: SearchIntent[] = [];
      if (!answersActions.state.location.userLocation) {
        searchIntents = await getSearchIntents(answersActions, false) || [];
      }
      executeSearchWithIntents(answersActions, false, searchIntents);
    };
    executeQuery();
  }, [answersActions]);

  return (
    <div className='UniversalSearchPage'>
      <UniversalResults
        appliedFiltersConfig={universalResultsFilterConfig}
        verticalConfigs={universalResultsConfig}
      />
    </div>
  );
}