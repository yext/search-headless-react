import { AnswersActionsProvider } from '@yext/answers-headless-react';
import DecoratedAppliedFilters from './components/DecoratedAppliedFilters';
import { StandardCard } from './components/cards/StandardCard';
import ResultsCount from './components/ResultsCount';
import SearchBar from './components/SearchBar';
import StaticFilters from './components/StaticFilters';
import VerticalResults from './components/VerticalResults';
import './sass/App.scss';

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
  return (
    <AnswersActionsProvider
      apiKey='2d8c550071a64ea23e263118a2b0680b'
      experienceKey='slanswers'
      locale='en'
      verticalKey='people'
    >
      <div className='start'>
        <SearchBar
          initialQuery='prompt'
        />
        test
        <StaticFilters
          title='~Country and Employee Departments~'
          options={staticFilterOptions}
        />
      </div>
      <div className='end'>
        <SearchBar
          placeholder='Search...'
        />
        <div>
          <ResultsCount />
          <DecoratedAppliedFilters 
            showFieldNames={true}
            hiddenFields={['builtin.entityType']}
            delimiter='|'
            mapStateToAppliedQueryFilters={state => state.vertical.results?.verticalResults.appliedQueryFilters}
          />
          <VerticalResults 
            CardComponent={StandardCard}
            cardConfig={{ showOrdinal: true }}
          />
        </div>
      </div>
    </AnswersActionsProvider>
  );
}

export default App;
