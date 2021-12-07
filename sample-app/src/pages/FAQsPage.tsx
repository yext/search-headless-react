import ResultsCount from '../components/ResultsCount';
import AlternativeVerticals from '../components/AlternativeVerticals';
import AppliedFilters from '../components/AppliedFilters';
import DirectAnswer from '../components/DirectAnswer';
import VerticalResults from '../components/VerticalResults';
import SpellCheck from '../components/SpellCheck';
import LocationBias from '../components/LocationBias';
import { StandardCard } from '../components/cards/StandardCard';
import { SearchIntent } from '@yext/answers-headless';
import { useLayoutEffect } from 'react';
import { useAnswersActions } from '@yext/answers-headless-react';
import { getSearchIntents, updateLocationIfNeeded, executeSearch } from '../utils/search-operations';

export default function FAQsPage({ verticalKey }: {
  verticalKey: string
}) {
  const answersActions = useAnswersActions();
  useLayoutEffect(() => {
    answersActions.setState({
      ...answersActions.state,
      universal: {}
    });
    answersActions.setVerticalKey(verticalKey);
    const executeQuery = async () => {
      let searchIntents: SearchIntent[] = [];
      if (!answersActions.state.location.userLocation) {
        searchIntents = await getSearchIntents(answersActions, true) || [];
        await updateLocationIfNeeded(answersActions, searchIntents);
      }
      executeSearch(answersActions, true);
    };
    executeQuery();
  }, [answersActions, verticalKey]);

  return (
    <div className='pt-7'>
      <DirectAnswer />
      <SpellCheck
        isVertical={true}
      />
      <ResultsCount />
      <AppliedFilters
        hiddenFields={['builtin.entityType']}
        customCssClasses={{
          nlpFilter: 'mb-4',
          removableFilter: 'mb-4'
        }}
      />
      <AlternativeVerticals
        currentVerticalLabel='FAQs'
        verticalsConfig={[
          { label: 'Events', verticalKey: 'events' },
          { label: 'Jobs', verticalKey: 'jobs' },
          { label: 'Locations', verticalKey: 'locations' }
        ]}
      />
      <VerticalResults
        CardComponent={StandardCard}
        displayAllResults={true}
      />
      <LocationBias isVertical={true} />
    </div>
  )
}