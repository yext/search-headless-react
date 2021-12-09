import ResultsCount from '../components/ResultsCount';
import AlternativeVerticals from '../components/AlternativeVerticals';
import AppliedFilters from '../components/AppliedFilters';
import DirectAnswer from '../components/DirectAnswer';
import VerticalResults from '../components/VerticalResults';
import SpellCheck from '../components/SpellCheck';
import LocationBias from '../components/LocationBias';
import { StandardCard } from '../components/cards/StandardCard';
import usePageSetupEffect from '../hooks/usePageSetupEffect';
import Facets from '../components/Facets';
import FilterSearch from '../components/FilterSearch';

const filterSearchFields = [{
  fieldApiName: 'name',
  entityType: 'location'
}, {
  fieldApiName: 'paymentOptions',
  entityType: 'location'
}, {
  fieldApiName: 'services',
  entityType: 'location'
}];

export default function LocationsPage({ verticalKey }: {
  verticalKey: string
}) {
  usePageSetupEffect(verticalKey);

  return (
    <div className='pt-7 flex'> 
      <div>
        <FilterSearch
          title='Filter Search!'
          sectioned={true}
          searchFields={filterSearchFields}
          screenReaderInstructionsId='FilterSearchId'/>
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