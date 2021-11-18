import ResultsCount from '../components/ResultsCount';
import AlternativeVerticals from '../components/AlternativeVerticals';
import FilterSearch from '../components/FilterSearch';
import DecoratedAppliedFilters from '../components/DecoratedAppliedFilters';
import StaticFilters from '../components/StaticFilters';
import VerticalResults from '../components/VerticalResults';
import SpellCheck from '../components/SpellCheck';
import LocationBias from '../components/LocationBias';
import Facets from '../components/Facets';
import '../sass/VerticalSearchPage.scss';
import { StandardCard } from '../components/cards/StandardCard';
import { useLayoutEffect } from 'react';
import { useAnswersActions } from '@yext/answers-headless-react';

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
]

const employeeFilterOptions = [
  {
    label: 'tech',
    fieldId: 'c_employeeDepartment',
    value: 'Technology'
  },
  {
    label: 'consult',
    fieldId: 'c_employeeDepartment',
    value: 'Consulting',
  },
  {
    label: 'fin',
    fieldId: 'c_employeeDepartment',
    value: 'Finance',
  }
]

const facetConfigs = {
  c_employeeDepartment: {
    label: 'Employee Department!'
  }
}

const staticFiltersGroupLabels = {
  c_employeeCountry: 'Employee Country',
  c_employeeDepartment: 'Employee Deparment'
}

const filterSearchFields = [{
  fieldApiName: 'builtin.location',
  entityType: 'ce_person',
  fetchEntities: false
},
{
  fieldApiName: 'name',
  entityType: 'ce_person',
  fetchEntities: false
}];

export default function VerticalSearchPage(props: {
  verticalKey: string
}) {
  const answersActions = useAnswersActions();
  useLayoutEffect(() => {
    answersActions.setState({
      ...answersActions.state,
      universal: {}
    });
    answersActions.setVerticalKey(props.verticalKey);
    answersActions.executeVerticalQuery();
  }, [answersActions, props.verticalKey]);

  return (
    <div className='VerticalSearchPage'>
      <FilterSearch
        title='Filter Search!'
        sectioned={true}
        searchFields={filterSearchFields}
        screenReaderInstructionsId='FilterSearchId'
      />
      <div className='start'>
        <StaticFilters
          title='~Country~'
          options={countryFilterOptions}
        />
        <StaticFilters
          title='~Employee Departments~'
          options={employeeFilterOptions}
        />
        <Facets
          searchOnChange={true}
          searchable={true}
          collapsible={true}
          defaultExpanded={true}
          facetConfigs={facetConfigs}
        />
        <SpellCheck
          isVertical={true}
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
          displayAllResults={true}
        />
        <LocationBias isVertical={false} />
      </div>
    </div>
  )
}