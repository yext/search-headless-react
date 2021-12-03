import ResultsCount from '../components/ResultsCount';
import AlternativeVerticals from '../components/AlternativeVerticals';
import DecoratedAppliedFilters from '../components/DecoratedAppliedFilters';
import DirectAnswer from '../components/DirectAnswer';
import StaticFilters from '../components/StaticFilters';
import VerticalResults from '../components/VerticalResults';
import SpellCheck from '../components/SpellCheck';
import LocationBias from '../components/LocationBias';
import Facets from '../components/Facets';
import { StandardCard } from '../components/cards/StandardCard';
import { useLayoutEffect } from 'react';
import { useAnswersActions } from '@yext/answers-headless-react';
import FilterSearch from '../components/FilterSearch';
import { SearchIntent } from '@yext/answers-headless-react';
import {
  executeSearch,
  getSearchIntents,
  updateLocationIfNeeded
} from '../utils/search-operations';

const countryFilterOptions = [
  {
    label: 'Canada',
    fieldId: 'c_employeeCountry',
    value: 'Canada',
  },
  {
    label: 'Remote',
    fieldId: 'c_employeeCountry',
    value: 'Remote'
  },
  {
    label: 'USA',
    fieldId: 'c_employeeCountry',
    value: 'United States',
  }
]

const employeeFilterOptions = [
  {
    label: 'Tech',
    fieldId: 'c_employeeDepartment',
    value: 'Technology'
  },
  {
    label: 'Consult',
    fieldId: 'c_employeeDepartment',
    value: 'Consulting',
  },
  {
    label: 'Fin',
    fieldId: 'c_employeeDepartment',
    value: 'Finance',
  }
]

const staticFiltersConfig = [{
  title: 'Country',
  options: countryFilterOptions
},{
  title: 'Employee Departments',
  options: employeeFilterOptions
}]

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
  entityType: 'ce_person'
},
{
  fieldApiName: 'name',
  entityType: 'ce_person'
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
    const executeQuery = async () => {
      let searchIntents: SearchIntent[] = [];
      if (!answersActions.state.location.userLocation) {
        searchIntents = await getSearchIntents(answersActions, true) || [];
        await updateLocationIfNeeded(answersActions, searchIntents);
      }
      executeSearch(answersActions, true);
    };
    executeQuery();
  }, [answersActions, props.verticalKey]);

  return (
    <div className='VerticalSearchPage'>
      {/* <FilterSearch
        title='Filter Search!'
        sectioned={true}
        searchFields={filterSearchFields}
        screenReaderInstructionsId='FilterSearchId'
      /> */}
      <div className='start'>
        <StaticFilters
          config={staticFiltersConfig}
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
        <DirectAnswer />
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