import { useRef, ChangeEventHandler, KeyboardEventHandler, useState } from 'react';
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
  const [query, setQuery] = useState<string>('');
  const [queryState, setQueryState] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(document.createElement('input'));

  const executeSearch = () => {
    answersActions.executeVerticalQuery();
  }
  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = evt => {
    if (evt.key === 'Enter') {
      evt.preventDefault();
      setQueryState(query);
      answersActions.setQuery(query);
      executeSearch();
    }
  }
  const handleChange: ChangeEventHandler<HTMLInputElement> = evt => {
    setQuery(evt.target.value)
    setQueryState(evt.target.value);
    answersActions.setQuery(evt.target.value);
    answersActions.executeVerticalAutoComplete().then(autocompleteResponse => {
      if (!autocompleteResponse) {
        return;
      }
      setAutocompleteResults(autocompleteResponse.results)
    });
  }
  const handleSelectAutocomplete = (value: string) => {
    setQuery(value);
  }
  return (
    <div className='SearchBar'>
      <div className='SearchBar-search'>
        <input
          className='SearchBar-input'
          ref={inputRef}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          value={query}
          data-query={query}
          data-queryState={queryState}
        />
        <button className='SearchBar-submit' onClick={executeSearch}>
          <MagnifyingGlassIcon/>
        </button>
      </div>
      <Autocomplete
        inputRef={inputRef}
        autocompleteResults={autocompleteResults}
        onEnter={() => executeSearch()}
        onSelect={handleSelectAutocomplete}
        onReset={() => setQuery(queryState)}
      />
    </div>
  )
}

export default SearchBar;