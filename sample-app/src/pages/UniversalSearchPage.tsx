import UniversalResults from '../components/UniversalResults';
import { useLayoutEffect } from 'react';
import { useAnswersActions } from '@yext/answers-headless-react';
import '../sass/UniversalSearchPage.scss';
import { UniversalResultsConfig } from '../universalResultsConfig';
import SearchHandler from '../utils/searchhandler';
import { SearchIntent } from '@yext/answers-headless';

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
      const searchIntents = await SearchHandler.getSearchIntents(answersActions, false);
      if (searchIntents?.includes(SearchIntent.NearMe)) {
        try {
          const position = await SearchHandler.getUserLocation();
          answersActions.setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        } catch (e) {
          console.error(e);
        }
      }
      SearchHandler.executeSearch(answersActions, false);
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