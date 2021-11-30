import './sass/App.scss';
import { AnswersHeadlessProvider } from '@yext/answers-headless-react';
import ResultsOnlyPage from './pages/ResultsOnlyPage';

export default function App() {
  return (
    <AnswersHeadlessProvider
      apiKey='2d8c550071a64ea23e263118a2b0680b'
      experienceKey='slanswers'
      locale='en'
      verticalKey='people'
    >
      <div className='App'>
        <ResultsOnlyPage />
      </div>
    </AnswersHeadlessProvider>
  );
}
