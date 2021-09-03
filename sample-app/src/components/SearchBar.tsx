import { useAnswersActions, useAnswersState, StateMapper } from '@yext/answers-headless-react';
import { AutocompleteResult } from '@yext/answers-core';
import InputDropdown from './InputDropdown';
import renderWithHighlighting from './utils/renderWithHighlighting';
import { ReactComponent as MagnifyingGlassIcon } from '../icons/magnifying_glass.svg';
// import '../sass/SearchBar.scss';
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
        className='text-lg'
        onClick={() => {
          answersActions.executeVerticalQuery();
        }}
      >
        <MagnifyingGlassIcon/>
      </button>
    )
  }

  return (
    <div className='h-10 w-full text-lg relative'>
      <InputDropdown
        inputValue={query}
        placeholder={placeholder}
        options={autocompleteResults.map(result => {
          return {
            value: result.value,
            render: () => renderWithHighlighting(result)
          }
        })}
        onSubmit={() => {
          answersActions.executeVerticalQuery();
        }}
        updateInputValue={value => {
          answersActions.setQuery(value);
        }}
        updateDropdown={() => {
          executeAutocomplete();
        }}
        renderButtons={renderSearchButton}
        cssClasses={{
          optionContainer: 'Autocomplete',
          option: 'Autocomplete__option',
          focusedOption: 'Autocomplete__option--focused',
          inputElement: 'flex-grow text-lg',
          inputContainer: 'flex flex-grow text-lg'
        }}
      />
    </div>
  )
}