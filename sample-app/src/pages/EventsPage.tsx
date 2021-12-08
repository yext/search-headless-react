import ResultsCount from '../components/ResultsCount';
import AlternativeVerticals from '../components/AlternativeVerticals';
import AppliedFilters from '../components/AppliedFilters';
import DirectAnswer from '../components/DirectAnswer';
import VerticalResults from '../components/VerticalResults';
import SpellCheck from '../components/SpellCheck';
import LocationBias from '../components/LocationBias';
import { StandardCard } from '../components/cards/StandardCard';
import usePage from '../hooks/usePage';
import Facets from '../components/Facets';

const facetConfigs = {
  c_employeeDepartment: {
    label: 'Employee Department!'
  }
}

export default function EventsPage({ verticalKey }: {
  verticalKey: string
}) {
  usePage(verticalKey);

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
  )
}