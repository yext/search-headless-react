import { useRef, KeyboardEvent, useState } from 'react';
import { useAnswersActions } from '@yext/answers-headless-react';
import '../sass/SearchBar.scss';
import { useEffect } from 'react';
import Autocomplete from './Autocomplete';
import { ReactComponent as MagnifyingGlassIcon } from '../icons/magnifying_glass.svg';
import { AutocompleteResult } from '@yext/answers-core';

function SearchBar({ verticalKey }: { name: string, verticalKey: string }) {
  const answersActions = useAnswersActions();
  useEffect(() => answersActions.setVerticalKey(verticalKey))
  const [autocompleteResults, setAutocompleteResults] = useState<AutocompleteResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(document.createElement('input'));

  const executeSearch = () => {
    answersActions.executeVerticalQuery();
  }
  const handleKeyDown = (evt: KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === 'Enter') {
      evt.preventDefault();
      executeSearch();
    }
  }
  const handleChange = () => {
    answersActions.setQuery(inputRef.current.value || '');
    answersActions.executeVerticalAutoComplete().then(autocompleteResponse => {
      if (!autocompleteResponse) {
        return;
      }
      setAutocompleteResults(autocompleteResponse.results)
    });
  }
  return (
    <div className='SearchBar'>
      <div className='SearchBar-search'>
        <input
          className='SearchBar-input'
          ref={inputRef}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
        />
        <button className='SearchBar-submit' onClick={executeSearch}>
          <MagnifyingGlassIcon/>
        </button>
      </div>
      <Autocomplete inputRef={inputRef} autocompleteResults={autocompleteResults}/>
    </div>
  )
}

export default SearchBar;