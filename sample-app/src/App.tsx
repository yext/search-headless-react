import UniversalSearchPage from './pages/UniversalSearchPage';
import FAQsPage from './pages/FAQsPage';
import EventsPage from './pages/EventsPage';
import PageRouter from './PageRouter';
import StandardLayout from './pages/StandardLayout';
import { AnswersHeadlessProvider } from '@yext/answers-headless-react';
import { universalResultsConfig } from './universalResultsConfig';
import JobsPage from './pages/JobsPage';
import LocationsPage from './pages/LocationsPage';

const routes = [
  {
    path: '/',
    exact: true,
    page: <UniversalSearchPage universalResultsConfig={universalResultsConfig} />
  },
  {
    path: '/faqs',
    page: <FAQsPage verticalKey='faqs'/>
  },
  {
    path: '/events',
    page: <EventsPage verticalKey='events'/>
  },
  {
    path: '/locations',
    page: <LocationsPage verticalKey='locations' />
  },
  {
    path: '/jobs',
    page: <JobsPage verticalKey='jobs' />
  }
];

export default function App() {
  return (
    <AnswersHeadlessProvider
      apiKey='3517add824e992916861b76e456724d9'
      experienceKey='answers-js-docs'
      locale='en'
      sessionTrackingEnabled={true}
    >
      <div className='flex justify-center px-8 py-6'>
        <div className='w-full max-w-5xl'>
          <PageRouter
            Layout={StandardLayout}
            routes={routes}
          />
        </div>
      </div>
    </AnswersHeadlessProvider>
  );
}
