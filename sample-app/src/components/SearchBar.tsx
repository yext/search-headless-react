import { useAnswersActions, useAnswersState, StateMapper } from '@yext/answers-headless-react';
import { AutocompleteResult } from '@yext/answers-core';
import Dropdown from './Dropdown';
import renderWithHighlighting from './utils/renderWithHighlighting';
import { ReactComponent as MagnifyingGlassIcon } from '../icons/magnifying_glass.svg';
import '../sass/SearchBar.scss';
import '../sass/Autocomplete.scss';

interface Props {
  placeholder?: string
  isVertical: boolean
}

/**
 * Renders a SearchBar that is hooked up with an Autocomplete component
 */
export default function SearchBar({ placeholder, isVertical }: Props) {
  const answersActions = useAnswersActions();
  const query = useAnswersState(state => state.query.query);
  const mapStateToAutocompleteResults: StateMapper<AutocompleteResult[] | undefined> = isVertical
    ? state => state.vertical.autoComplete?.results
    : state => state.universal.autoComplete?.results;
  const autocompleteResults = useAnswersState(mapStateToAutocompleteResults) || [];

  function executeAutocomplete () {
    isVertical 
      ? answersActions.executeVerticalAutoComplete()
      : answersActions.executeUniversalAutoComplete()
  }

  function renderSearchButton () {
    return (
      <button
        className='SearchBar__submitButton'
        onClick={() => {
          answersActions.executeVerticalQuery();
        }}
      >
        <MagnifyingGlassIcon/>
      </button>
    )
  }

  return (
    <div className='SearchBar'>
      <Dropdown
        inputValue={query}
        placeholder={placeholder}
        options={autocompleteResults.map(result => {
          return {
            value: result.value,
            render: () => renderWithHighlighting(result)
          }
        })}
        onInputValueChange={query => {
          answersActions.setQuery(query);
          executeAutocomplete();
        }}
        onInputClick={executeAutocomplete}
        onSubmit={query => {
          answersActions.setQuery(query);
          answersActions.executeVerticalQuery();
        }}
        onFocusedOptionChange={query => {
          answersActions.setQuery(query);
        }}
        renderWithinInputContainer={renderSearchButton}
        cssClasses={{
          optionContainer: 'Autocomplete',
          option: 'Autocomplete__option',
          selectedOption: 'Autocomplete__option--selected',
          inputElement: 'SearchBar__input',
          inputContainer: 'SearchBar__inputContainer'
        }}
      />
    </div>
  )
}