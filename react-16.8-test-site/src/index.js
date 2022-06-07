import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AnswersHeadlessProvider } from '@yext/answers-headless-react';

const config = {
  apiKey: '2d8c550071a64ea23e263118a2b0680b',
  experienceKey: 'slanswers-hier-facets',
  locale: 'en',
  experienceVersion: 'STAGING',
  businessId: 123123
}

ReactDOM.render(
  <React.StrictMode>
    <AnswersHeadlessProvider {...config}>
      <App />
    </AnswersHeadlessProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

