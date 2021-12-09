import ResultsCount from '../components/ResultsCount';
import AlternativeVerticals from '../components/AlternativeVerticals';
import AppliedFilters from '../components/AppliedFilters';
import DirectAnswer from '../components/DirectAnswer';
import VerticalResults from '../components/VerticalResults';
import SpellCheck from '../components/SpellCheck';
import LocationBias from '../components/LocationBias';
import { StandardCard } from '../components/cards/StandardCard';
import usePageSetupEffect from '../hooks/usePageSetupEffect';

export default function FAQsPage({ verticalKey }: {
  verticalKey: string
}) {
  usePageSetupEffect(verticalKey);

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