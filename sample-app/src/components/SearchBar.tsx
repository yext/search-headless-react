import { useRef, ChangeEventHandler, KeyboardEventHandler, useState } from 'react';
import { AutocompleteResult } from '@yext/answers-core';
import { useAnswersActions, useAnswersState } from '@yext/answers-headless-react';
import Autocomplete from './Autocomplete';
import { ReactComponent as MagnifyingGlassIcon } from '../icons/magnifying_glass.svg';
import '../sass/SearchBar.scss';

/**
 * Renders a SearchBar that is hooked up with an Autocomplete component
 */
export default function SearchBar() {
  const answersActions = useAnswersActions();
  const globalQueryState = useAnswersState(state => state.query?.query) || '';
  const [autocompleteResults, setAutocompleteResults] = useState<AutocompleteResult[]>([]);
  const [displayQuery, setDisplayQuery] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(document.createElement('input'));
 
  const executeSearch = (query: string) => {
    answersActions.setQuery(query);
    answersActions.executeVerticalQuery();
  }
  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = evt => {
    if (evt.key === 'Enter') {
      executeSearch(displayQuery);
    }
  }
  const handleChange: ChangeEventHandler<HTMLInputElement> = evt => {
    setDisplayQuery(evt.target.value);
    answersActions.setQuery(evt.target.value);
    answersActions.executeVerticalAutoComplete().then(autocompleteResponse => {
      if (!autocompleteResponse) {
        return;
      }
      setAutocompleteResults(autocompleteResponse.results)
    });
  }
  return (
    <div className='SearchBar'>
      <div className='SearchBar__inputContainer'>
        <input
          className='SearchBar__input'
          ref={inputRef}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          value={displayQuery}
        />
        <button className='SearchBar__submitButton' onClick={() => executeSearch(displayQuery)}>
          <MagnifyingGlassIcon/>
        </button>
      </div>
      <Autocomplete
        inputRef={inputRef}
        autocompleteResults={autocompleteResults}
        onSelect={query => {
          setDisplayQuery(query || globalQueryState || '');
        }}
        onOptionClick={query => {
          setDisplayQuery(query);
          executeSearch(query);
        }}
      />
    </div>
  )
}
