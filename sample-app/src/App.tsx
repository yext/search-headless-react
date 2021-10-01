import './sass/App.scss';
import { AnswersActionsProvider } from '@yext/answers-headless-react';
import AlternativeVerticals from './components/AlternativeVerticals';
import { DecoratedAppliedFiltersWithMapping } from './components/DecoratedAppliedFilters';
import { StandardCard } from './components/cards/StandardCard';
import { VerticalResultsCount } from './components/ResultsCount';
import SearchBar from './components/SearchBar';
import StaticFilters from './components/StaticFilters';
import VerticalResults from './components/VerticalResults';
import SpellCheck from './components/SpellCheck';
import LocationBias from './components/LocationBias';
import UniversalResults from './components/UniversalResults';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

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
        cardType: "StandardCard",
        showOrdinal: true
      },
      limit: 10
    },
    events: {
      label: "events",
      cardConfig: {
        cardType: "StandardCard",
        showOrdinal: true
      },
      limit: 8
    },
    links: {
      label: "links",
      viewMore: true,
      cardConfig: {
        cardType: "StandardCard",
        showOrdinal: true
      },
      limit: 3
    },
    faq: {
      label: "FAQs",
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
                <VerticalResultsCount />
                <DecoratedAppliedFiltersWithMapping
                  showFieldNames={true}
                  hiddenFields={['builtin.entityType']}
                  delimiter='|' 
                  mapStateToAppliedQueryFilters={state => state.vertical?.results?.verticalResults.appliedQueryFilters}                  
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
