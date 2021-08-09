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
    <Provider>
      <div className='left'>
        <SearchBar />
        test
        <StaticFilters
          title='~Employee Departments~'
          options={staticFilterOptions}
        />
      </div>
      <div className='right'>
        <SearchBar />
        <ResultsCount />
        <VerticalResults 
          CardComponent={StandardCard}
          cardConfig={{ showOrdinal: true }}
        />
      </div>
    </Provider>
  );
}

interface PropsWithChildren {
  children?: ReactChildren | ReactChild | (ReactChildren | ReactChild)[]
}

function Provider({ children }: PropsWithChildren) {
  // Temporary place to set the verticalKey, in the future this should happen in some sort
  // of router component, which may end up being the Navigation component
  function SetVerticalKey() {
    const answersActions = useAnswersActions();
    useEffect(() => answersActions.setVerticalKey('people'))
    return <Fragment>{children}</Fragment>;
  }
  return (
    <AnswersActionsProvider
      apiKey='2d8c550071a64ea23e263118a2b0680b'
      experienceKey='slanswers'
      locale='en'
    >
      <SetVerticalKey/>
    </AnswersActionsProvider>
  )
}

export default App;
