import VerticalResultsDisplay from './components/VerticalResultsDisplay';
import VerticalSearchForm from './components/VerticalSearchForm';

import './App.css';
import { AnswersActionsProvider } from '@yext/answers-headless-react';
import StaticFilters from './components/StaticFilters';
import ResultsCount from './components/ResultsCount';

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
      <div className='left'>
        test
        <StaticFilters
          title='~Employee Departments~'
          options={staticFilterOptions}
        />
      </div>
      <div className='right'>
        <VerticalSearchForm verticalKey='people' />
        <ResultsCount />
        <VerticalResultsDisplay
          randomString='this is my arbitrary string!'
        />
      </div>
    </AnswersActionsProvider>
  );
}

export default App;
