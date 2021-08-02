import { useRef, KeyboardEvent } from 'react';
import { useAnswersActions } from '@yext/answers-headless-react';

function VerticalSearchForm({ verticalKey }: { verticalKey: string }) {
  const answersActions = useAnswersActions();
  const inputRef = useRef<HTMLInputElement>(document.createElement('input'));

  answersActions.setVerticalKey(verticalKey);
  const executeSearch = () => {
    answersActions.setQuery(inputRef.current.value || '');
    answersActions.executeVerticalQuery();
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

export default VerticalSearchForm;