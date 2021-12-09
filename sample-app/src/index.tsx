import React from 'react';
import ReactDOM from 'react-dom';
import './tailwind.css';
import './sass/index.scss';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

registerServiceWorker();