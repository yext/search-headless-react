import { useRef, KeyboardEvent } from 'react';
import { StatefulCore } from '@yext/answers-headless';
import { decorateWithStore } from '@yext/answers-headless-react';

function VerticalSearchForm(props: { storeActions: StatefulCore }) {
  const storeActions: StatefulCore = props.storeActions;
  const inputRef = useRef<HTMLInputElement>(document.createElement('input'));
  const executeSearch = () => {
    storeActions.setQuery(inputRef.current.value || '');
    storeActions.executeVerticalQuery();
  }
  const handleKeyDown = (evt : KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === 'Enter') {
      executeSearch();
    }
  }
  return (
    <div className='SearchForm'>
      <input className='SearchForm-input' ref={inputRef} onKeyDown={e => handleKeyDown(e)}/>
      <button onClick={executeSearch}>
        Vertical Search
      </button>
    </div>
  )
}

export default decorateWithStore(VerticalSearchForm)