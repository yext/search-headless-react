import './sass/App.scss';
import { StandardCard } from './components/cards/StandardCard';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import VerticalSearchPage from './pages/VerticalSearchPage';
import UniversalSearchPage from './pages/UniversalSearchPage';
import Navigation from './components/Navigation';
import SearchBar from './components/SearchBar';
import { useAnswersState } from '@yext/answers-headless-react';

const universalResultsConfig = {
  people: {
    label: "People",
    viewMore: true,
    cardConfig: {
      CardComponent: StandardCard,
      showOrdinal: true
    }
  },
  events: {
    label: "Events",
    cardConfig: {
      CardComponent: StandardCard,
      showOrdinal: true
    }
  },
  links: {
    label: "Links",
    viewMore: true,
    cardConfig: {
      CardComponent: StandardCard,
      showOrdinal: true
    }
  },
  financial_professionals: {
    label: "Financial Professionals",
  },
  healthcare_professionals: {
    label: "Healthcare Professionals",
  }
}

const navLinks = [
  {
    to: '/',
    label: 'All'
  },
  ...Object.entries(universalResultsConfig).map(([verticalKey, config]) => ({
    to: verticalKey,
    label: config.label
  }))
]

function App() {
  const verticalKey = useAnswersState(state => state.vertical.key);
  return (
    <Router>
      <div className='App'>
        <SearchBar
          placeholder='Search...'
          isVertical={!!verticalKey}
        />
        <Navigation links={navLinks} />
        <Switch>
          <Route exact path='/'>
            <UniversalSearchPage universalResultsConfig={universalResultsConfig} />
          </Route>
          {
            Object.keys(universalResultsConfig).map(key => {
              switch (key) {
                default:
                  return (
                    <Route path={`/${key}`}>
                      <VerticalSearchPage verticalKey={key} />
                    </Route>
                  )
              }
            })
          }
        </Switch>
      </div>
    </Router>
  );
}

export default App;
