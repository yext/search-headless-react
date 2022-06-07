import React from 'react';
import { useAnswersActions, useAnswersState } from '@yext/answers-headless-react';

function App() {
  return (
    <div>
      <Search/>
      <Results/>
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
