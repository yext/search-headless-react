import { useAnswersActions, useAnswersState, StateMapper } from '@yext/answers-headless-react';
import { AutocompleteResult } from '@yext/answers-core';
import Autocomplete from './Autocomplete';
import { ReactComponent as MagnifyingGlassIcon } from '../icons/magnifying_glass.svg';
import '../sass/SearchBar.scss';

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

  function renderInputAndDropdown(input: JSX.Element, dropdown: JSX.Element | null) {
    return (
      <>
        <div className='SearchBar__inputContainer'>
          {input}
          <button
            className='SearchBar__submitButton'
            onClick={() => {
              answersActions.executeVerticalQuery();
            }}
          >
            <MagnifyingGlassIcon/>
          </button>
        </div>
        {dropdown}
      </>
    )
  }

  return (
    <div className='SearchBar'>
      <Autocomplete
        autocompleteResults={autocompleteResults}
        renderInputAndDropdown={renderInputAndDropdown}
        inputClassName='SearchBar__input'
        placeholder={placeholder}
        query={query}
        executeAutocomplete={() => { 
          isVertical 
          ? answersActions.executeVerticalAutoComplete()
          : answersActions.executeUniversalAutoComplete()
        }}
        onTextChange={query => {
          answersActions.setQuery(query);
        }}
        onSubmit={query => {
          answersActions.setQuery(query);
          answersActions.executeVerticalQuery();
        }}
        onSelectedIndexChange={query => {
          answersActions.setQuery(query);
        }}
      />
    </div>
  )
}