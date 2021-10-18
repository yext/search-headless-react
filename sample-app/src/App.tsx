import './sass/App.scss';
import VerticalSearchPage from './pages/VerticalSearchPage';
import UniversalSearchPage from './pages/UniversalSearchPage';
import PageRouter from './PageRouter';
import StandardLayout from './pages/StandardLayout';
import { AnswersActionsProvider } from '@yext/answers-headless-react';
import { universalResultsConfig } from './universalResultsConfig';

const routes = [
  {
    path: '/',
    exact: true,
    page: <UniversalSearchPage universalResultsConfig={universalResultsConfig} />
  },
  ...Object.keys(universalResultsConfig).map(key => {
    return {
      path: `/${key}`,
      page: <VerticalSearchPage verticalKey={key} />
    }
  })
];

export default function App() {
  return (
    <AnswersActionsProvider
      apiKey='2d8c550071a64ea23e263118a2b0680b'
      experienceKey='slanswers'
      locale='en'
      verticalKey='people'
    >
      <div className='App'>
        <PageRouter
          Layout={StandardLayout}
          routes={routes}
        />
      </div>
    </AnswersActionsProvider>
  );
}
