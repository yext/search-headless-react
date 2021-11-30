import { useState } from 'react';
import { useAnswersActions } from '@yext/answers-headless-react';

import VerticalResults from '../components/VerticalResults';
import { StandardCard } from '../components/cards/StandardCard';
import Facets from '../components/Facets';
import StaticFilters from '../components/StaticFilters';
import ResultsCount from '../components/ResultsCount';
import DecoratedAppliedFilters from '../components/DecoratedAppliedFilters';
import AlternativeVerticals from '../components/AlternativeVerticals';

import '../sass/ResultsOnlyPage.scss';

const facetConfigs = {
  c_employeeDepartment: {
    label: 'Employee Department!'
  }
};

const countryFilterOptions = [
  {
    label: 'canada',
    fieldId: 'c_employeeCountry',
    value: 'Canada',
  },
  {
    label: 'remote',
    fieldId: 'c_employeeCountry',
    value: 'Remote'
  },
  {
    label: 'usa',
    fieldId: 'c_employeeCountry',
    value: 'United States',
  }
];

const staticFiltersGroupLabels = {
  c_employeeCountry: 'Employee Country',
  c_employeeDepartment: 'Employee Deparment'
}

export default function ResultsOnlyPage(): JSX.Element {
  const [ isInitialLoad, setInitialLoad ] = useState(true);

  const actions = useAnswersActions();
  if (isInitialLoad) {
    actions.setQuery('technology');
    actions.executeVerticalQuery();
    setInitialLoad(false);
  }

  return (
    <div className='results-only-page'>
      <div className='start'>
        <StaticFilters
          title='Country'
          options={countryFilterOptions}
        />
        <Facets
          searchOnChange={true}
          searchable={true}
          collapsible={true}
          defaultExpanded={true}
          facetConfigs={facetConfigs}
        />
      </div>
      <div className='end'>
        <ResultsCount />
        <DecoratedAppliedFilters
          showFieldNames={true}
          hiddenFields={['builtin.entityType']}
          delimiter='|'
          staticFiltersGroupLabels={staticFiltersGroupLabels}
        />
        <AlternativeVerticals
          currentVerticalLabel='People'
          verticalsConfig={[
            { label: 'Locations', verticalKey: 'KM' },
            { label: 'FAQs', verticalKey: 'faq' }
          ]}
        />
        <VerticalResults
          CardComponent={StandardCard}
          cardConfig={{ showOrdinal: true }}
          displayAllResults={false}
        />
      </div>
    </div>
  );
}