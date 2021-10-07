import './sass/App.scss';
import { AnswersActionsProvider } from '@yext/answers-headless-react';
import AlternativeVerticals from './components/AlternativeVerticals';
import DecoratedAppliedFilters from './components/DecoratedAppliedFilters';
import { StandardCard } from './components/cards/StandardCard';
import ResultsCount from './components/ResultsCount';
import SearchBar from './components/SearchBar';
import StaticFilters from './components/StaticFilters';
import VerticalResults from './components/VerticalResults';
import SpellCheck from './components/SpellCheck';
import LocationBias from './components/LocationBias';
import UniversalResults from './components/UniversalResults';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Facets from './components/Facets';

function App() {
  const staticFilterOptions = [
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
    },
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

  const universalResultsConfig = {
    people: {
      label: "People",
      viewMore: true,
      cardConfig: {
        CardComponent: StandardCard,
        showOrdinal: true
      }
    },
    events: {
      label: "events",
      cardConfig: {
        CardComponent: StandardCard,
        showOrdinal: true
      }
    },
    links: {
      label: "links",
      viewMore: true,
      cardConfig: {
        CardComponent: StandardCard,
        showOrdinal: true
      }
    },
    financial_professionals: {
      label: "Financial Professionals",
    },
    healthcare_professionals: {
      label: "Healthcare Professionals",
    }
  }

  const universalResultsFilterConfig = {
    show: true
  };

  const facetConfigs = {
    c_employeeDepartment: {
      label: 'Employee Department!'
    }
  }

  return (
    <AnswersActionsProvider
      apiKey='2d8c550071a64ea23e263118a2b0680b'
      experienceKey='slanswers'
      locale='en'
      verticalKey='people'
    >
      {/* 
      TODO: use Navigation component for routing when that's added to repo.
      current setup is for testing purposes. 
      */}
      <Router>
        <Switch>
          {/* universal search */}
          <Route exact path='/'>
            <div className='start'>
              test
            </div>
            <div className='end'>
              <SearchBar
                placeholder='Search...'
                isVertical={false}
              />
              <div>
                <UniversalResults
                  appliedFiltersConfig={universalResultsFilterConfig}
                  verticalConfigs={universalResultsConfig}
                />
              </div>
            </div>
          </Route>

          {/* vertical page */}
          <Route path={Object.keys(universalResultsConfig).map(key => `/${key}`)}>
            <div>
              A VERTICAL PAGE!
            </div>
          </Route>

          {/* vertical search */}
          <Route exact path='/vertical'>
            <div className='start'>
              test
              <StaticFilters
                title='~Country and Employee Departments~'
                options={staticFilterOptions}
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
              <SearchBar
                placeholder='Search...'
                isVertical={true}
              />
              <div>
                <ResultsCount />
                <DecoratedAppliedFilters
                  showFieldNames={true}
                  hiddenFields={['builtin.entityType']}
                  delimiter='|'
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
          </Route>
        </Switch>
      </Router>
    </AnswersActionsProvider>
  );
}

export default App;
