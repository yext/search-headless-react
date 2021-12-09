import ResultsCount from '../components/ResultsCount';
import AlternativeVerticals from '../components/AlternativeVerticals';
import AppliedFilters from '../components/AppliedFilters';
import DirectAnswer from '../components/DirectAnswer';
import VerticalResults from '../components/VerticalResults';
import SpellCheck from '../components/SpellCheck';
import LocationBias from '../components/LocationBias';
import { StandardCard } from '../components/cards/StandardCard';
import usePageSetupEffect from '../hooks/usePageSetupEffect';
import StaticFilters from '../components/StaticFilters';

const staticFiltersConfig = [{
  title: 'Venue',
  options: [
    {
      label: 'West End Avenue',
      fieldId: 'venueName',
      value: 'West End Avenue'
    },
    {
      label: 'Peaceful Coffee',
      fieldId: 'venueName',
      value: 'Peaceful Coffee',
    },
  ]
}]

export default function EventsPage({ verticalKey }: {
  verticalKey: string
}) {
  usePageSetupEffect(verticalKey);

  return (
    <div className='pt-7 flex'>
      <div>
        <StaticFilters
          filterConfig={staticFiltersConfig}
        />
      </div>
      <div className='ml-10 flex-grow'>
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
          currentVerticalLabel='Events'
          verticalsConfig={[
            { label: 'FAQs', verticalKey: 'faqs' },
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
    </div>
  )
}