import React from 'react';
import ReactDOM from 'react-dom';
import { AnswersActionsProvider } from '@yext/answers-headless-react';
import './sass/index.scss';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <AnswersActionsProvider
      apiKey='2d8c550071a64ea23e263118a2b0680b'
      experienceKey='slanswers'
      locale='en'
    >
      <App />
    </AnswersActionsProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

