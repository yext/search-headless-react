import { AnswersActionsProvider } from '@yext/answers-headless-react';
import AppliedFilters from './components/AppliedFilters';
import { StandardCard } from './components/cards/StandardCard';
import ResultsCount from './components/ResultsCount';
import SearchBar from './components/SearchBar';
import StaticFilters from './components/StaticFilters';
import VerticalResults from './components/VerticalResults';
import './sass/App.scss';

function App() {
  const staticFilterOptions = [
    {
      field: 'c_employeeDepartment',
      value: 'Technology'
    },
    {
      field: 'c_employeeDepartment',
      value: 'Consulting',
    },
    {
      field: 'c_employeeDepartment',
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
          title='~Employee Departments~'
          options={staticFilterOptions}
        />
      </div>
      <div className='end'>
        <SearchBar
          placeholder='Search...'
        />
        <div>
          <ResultsCount />
          <AppliedFilters 
            showFieldNames={true}
            hiddenFields={['builtin.entityType']}
            delimiter='|'
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
