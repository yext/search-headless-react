import UniversalResults from '../components/UniversalResults';
import DirectAnswer from '../components/DirectAnswer';
import { useLayoutEffect } from 'react';
import { useAnswersActions } from '@yext/answers-headless-react';
import { SearchIntent } from '@yext/answers-headless-react';
import { UniversalResultsConfig } from '../universalResultsConfig';
import SpellCheck from '../components/SpellCheck';
import {
  executeSearch,
  getSearchIntents,
  updateLocationIfNeeded
} from '../utils/search-operations';

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
        updateLocationIfNeeded(answersActions, searchIntents);
      }
      executeSearch(answersActions, false);
    };
    executeQuery();
  }, [answersActions]);

  return (
    <div className='UniversalSearchPage'>
      <SpellCheck
        isVertical={false}
      />
      <DirectAnswer />
      <UniversalResults
        appliedFiltersConfig={universalResultsFilterConfig}
        verticalConfigs={universalResultsConfig}
      />
    </div>
  );
}