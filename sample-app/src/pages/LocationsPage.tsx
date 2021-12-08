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
import FilterSearch from '../components/FilterSearch';
import StaticFilters, { Divider } from '../components/StaticFilters';


export default function LocationsPage({ verticalKey }: {
  verticalKey: string
}) {
  usePage(verticalKey);

  return (
    <div className='pt-7 flex'> 
      <div>
        <Facets
          searchOnChange={true}
          searchable={true}
          collapsible={true}
          defaultExpanded={true}/>
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
          currentVerticalLabel='Locations'
          verticalsConfig={[
            { label: 'FAQs', verticalKey: 'faqs' },
            { label: 'Jobs', verticalKey: 'jobs' },
            { label: 'Events', verticalKey: 'events' }
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