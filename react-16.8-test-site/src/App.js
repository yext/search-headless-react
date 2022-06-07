import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useAnswersActions, useAnswersState } from '@yext/answers-headless-react';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Search/>
        <Results/>
      </header>
    </div>
  );
}

function Search() {
  const actions = useAnswersActions();
  return (
    <input onKeyDown={e => {
      if (e.key === 'Enter') {
        actions.setQuery(e.target.value);
        actions.executeUniversalQuery()
      }
    }}></input>
  )
}

function Results() {
  const v = useAnswersState(s => s.universal.verticals) ?? [];
  return (
    <div>
      {v.map(vr => (
        <div key={vr.resultsCount + vr.verticalKey}>
          {vr.verticalKey}:
          -----
          {vr.results.map(r => (
            <div style={{ display: 'flex' }} key={r.index}>
              {r.name}
            </div>
          ))}  
          -----
        </div>
      ))}
    </div>
  )
}

export default App;
