import { AnswersActionsProvider } from '@yext/answers-headless-react';
import { StandardCard } from './components/cards/StandardCard';
import ResultsCount from './components/ResultsCount';
import SearchBar from './components/SearchBar';
import SetVerticalKey from './components/SetVerticalKey';
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
    >
      <SetVerticalKey>
        <div className='left'>
          <SearchBar
            initialQuery='virginia'
          />
          test
          <StaticFilters
            title='~Employee Departments~'
            options={staticFilterOptions}
          />
        </div>
        <div className='right'>
          <SearchBar
            placeholder='Search...'
          />
          <ResultsCount />
          <VerticalResults
            CardComponent={StandardCard}
            cardConfig={{ showOrdinal: true }}
          />
        </div>
      </SetVerticalKey>
    </AnswersActionsProvider>
  );
}

export default App;
