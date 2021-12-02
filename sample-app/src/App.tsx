import './sass/App.scss';
import VerticalSearchPage from './pages/VerticalSearchPage';
import UniversalSearchPage from './pages/UniversalSearchPage';
import FilterSearchPage from './pages/FilterSearchPage';
import FilterSearchResultsPage from './pages/FilterSearchResultsPage';
import PageRouter from './PageRouter';
import StandardLayout from './pages/StandardLayout';
import { AnswersHeadlessProvider } from '@yext/answers-headless-react';
import { universalResultsConfig } from './universalResultsConfig';

const routes = [
  {
    path: '/',
    exact: true,
    page: <UniversalSearchPage universalResultsConfig={universalResultsConfig} />,
    Layout: StandardLayout
  },
  {
    path: '/filter-search-page',
    page: <FilterSearchPage verticalKey='people' />
  },
  {
    path: '/filter-search-results-page',
    page: <FilterSearchResultsPage verticalKey='people' />
  },
  ...Object.keys(universalResultsConfig).map(key => {
    return {
      path: `/${key}`,
      page: <VerticalSearchPage verticalKey={key} />,
      Layout: StandardLayout
    }
  })
];

export default function App() {
  return (
    <AnswersHeadlessProvider
      apiKey='2d8c550071a64ea23e263118a2b0680b'
      experienceKey='slanswers'
      locale='en'
      verticalKey='people'
      sessionTrackingEnabled={true}
    >
      <div className='App'>
        <PageRouter
          routes={routes}
        />
      </div>
    </AnswersHeadlessProvider>
  );
}
