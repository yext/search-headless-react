import VerticalResults from './components/VerticalResults';
import VerticalSearchForm from './components/VerticalSearchForm';

import './sass/App.scss';
import { AnswersActionsProvider } from '@yext/answers-headless-react';
import StaticFilters from './components/StaticFilters';
import { StandardCard } from './components/cards/StandardCard';
import VerticalResultsHeader from './components/VerticalResultsHeader';

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
        <VerticalResults 
          CardComponent={StandardCard}
          cardConfig={{ showOrdinal: true }}
        >
          <VerticalResultsHeader showResultsCount={true} />
        </VerticalResults>
      </div>
    </AnswersActionsProvider>
  );
}

export default App;
