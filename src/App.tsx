import VerticalKeyInput from './components/VerticalKeyInput';
import VerticalResultsDisplay from './components/VerticalResultsDisplay';
import VerticalSearchForm from './components/VerticalSearchForm';

import './App.css';
import { StatefulCoreProvider } from './bindings/StatefulCoreProvider';
import TwoWayData from './components/TwoWayData';

function App() {
  return (
    <StatefulCoreProvider
      apiKey='2d8c550071a64ea23e263118a2b0680b'
      experienceKey='slanswers'
      locale='en'
    >
      <VerticalKeyInput/>
      <VerticalSearchForm/>
      <VerticalResultsDisplay randomString='random string'/>
      <TwoWayData />
    </StatefulCoreProvider>
  );
}

export default App;
