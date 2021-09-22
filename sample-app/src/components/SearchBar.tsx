import { useAnswersActions, useAnswersState, StateMapper } from '@yext/answers-headless-react';
import { AutocompleteResult } from '@yext/answers-core';
import InputDropdown from './InputDropdown';
import renderWithHighlighting from './utils/renderWithHighlighting';
import { ReactComponent as MagnifyingGlassIcon } from '../icons/magnifying_glass.svg';
import autocompleteStyles from '../sass/Autocomplete.module.scss';
import { ThemeContext } from '../providers/ThemeProvider';
import { useContext } from 'react';

interface Props {
  placeholder?: string
  isVertical: boolean
}

/**
 * Renders a SearchBar that is hooked up with an Autocomplete component
 */
export default function SearchBar({ placeholder, isVertical }: Props) {
  const theme = useContext(ThemeContext);
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
    <div className={theme.SearchBar}>
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
          optionContainer: autocompleteStyles.Autocomplete,
          option: autocompleteStyles.Autocomplete__option,
          focusedOption: autocompleteStyles.Autocomplete__option___focused,
          inputElement: theme.SearchBar__input,
          inputContainer: theme.SearchBar__inputContainer
        }}
      />
    </div>
  )
}