// import VerticalKeyInput from './components/VerticalKeyInput';
import VerticalResultsDisplay from './components/VerticalResultsDisplay';
import VerticalSearchForm from './components/VerticalSearchForm';

import './App.css';
import { StatefulCoreProvider } from './bindings/StatefulCoreProvider';
import StaticFilters from './components/StaticFilters';
import ResultsCount from './components/ResultsCount';

// import TwoWayData from './components/TwoWayData';

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
    <StatefulCoreProvider
      apiKey='2d8c550071a64ea23e263118a2b0680b'
      experienceKey='slanswers'
      locale='en'
      verticalKey='people'
    >
      <div className='left'>
        <StaticFilters
          title='~Employee Departments~'
          options={staticFilterOptions}
        />
      </div>
      <div className='right'>
        <VerticalSearchForm/>
        <ResultsCount />
        <VerticalResultsDisplay
          randomString='this is my arbitrary string!'
        />
      </div>
    </StatefulCoreProvider>
  );
}

export default App;
