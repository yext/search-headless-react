import { useEffect, Fragment, ReactChild, ReactChildren } from 'react';
import { AnswersActionsProvider, useAnswersActions } from '@yext/answers-headless-react';
import VerticalResults from './components/VerticalResults';
import SearchBar from './components/SearchBar';
import StaticFilters from './components/StaticFilters';
import ResultsCount from './components/ResultsCount';
import { StandardCard } from './components/cards/StandardCard';
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
            placeholder='search me!'
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

interface PropsWithChildren {
  children?: ReactChildren | ReactChild | (ReactChildren | ReactChild)[]
}

// Temporary place to set the verticalKey, in the future this should happen in some sort
// of router component, which may end up being the Navigation component
function SetVerticalKey({ children }: PropsWithChildren) {
  const answersActions = useAnswersActions();
  useEffect(() => answersActions.setVerticalKey('people'))
  return <Fragment>{children}</Fragment>;
}

export default App;
