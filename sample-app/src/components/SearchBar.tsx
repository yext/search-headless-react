import { useRef, ChangeEventHandler, KeyboardEventHandler, useState } from 'react';
import { AutocompleteResult } from '@yext/answers-core';
import { useAnswersActions, useAnswersState } from '@yext/answers-headless-react';
import Autocomplete from './Autocomplete';
import { ReactComponent as MagnifyingGlassIcon } from '../icons/magnifying_glass.svg';
import '../sass/SearchBar.scss';

interface Props {
  placeholder?: string
  initialQuery?: string
}

/**
 * Renders a SearchBar that is hooked up with an Autocomplete component
 */
export default function SearchBar({
  placeholder,
  initialQuery = ''
}: Props) {
  const answersActions = useAnswersActions();
  const globalQueryState = useAnswersState(state => state.query?.query) || '';
  const [autocompleteResults, setAutocompleteResults] = useState<AutocompleteResult[]>([]);
  const [displayQuery, setDisplayQuery] = useState<string>(initialQuery);
  const inputRef = useRef<HTMLInputElement>(document.createElement('input'));
 
  function executeSearch(query: string) {
    answersActions.setQuery(query);
    answersActions.executeVerticalQuery();
  }

  function updateAutocomplete() {
    answersActions.setQuery(displayQuery);
    answersActions.executeVerticalAutoComplete().then(autocompleteResponse => {
      if (!autocompleteResponse) {
        return;
      }
      setAutocompleteResults(autocompleteResponse.results)
    });
  }

  const handleChange: ChangeEventHandler<HTMLInputElement> = evt => {
    setDisplayQuery(evt.target.value);
    answersActions.setQuery(evt.target.value);
    updateAutocomplete();
  }
  return (
    <div className='SearchBar'>
      <div className='SearchBar__inputContainer'>
        <input
          className='SearchBar__input'
          ref={inputRef}
          onChange={handleChange}
          value={displayQuery}
          placeholder={placeholder}
          onClick={updateAutocomplete}
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
        onEnter={() => executeSearch(displayQuery)}
      />
    </div>
  )
}
