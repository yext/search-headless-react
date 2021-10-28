import { useAnswersActions, useAnswersState, StateSelector } from '@yext/answers-headless-react';
import { AutocompleteResult } from '@yext/answers-core';
import InputDropdown from './InputDropdown';
import renderWithHighlighting from './utils/renderWithHighlighting';
import { ReactComponent as MagnifyingGlassIcon } from '../icons/magnifying_glass.svg';
import '../sass/SearchBar.scss';
import '../sass/Autocomplete.scss';
import LoadingIndicator from './LoadingIndicator';

interface Props {
  placeholder?: string,
  isVertical: boolean,
  instructions?: string
}

/**
 * Renders a SearchBar that is hooked up with an Autocomplete component
 */
export default function SearchBar({ placeholder, isVertical, instructions }: Props) {
  const answersActions = useAnswersActions();
  const query = useAnswersState(state => state.query.query);
  const mapStateToAutocompleteResults: StateSelector<AutocompleteResult[] | undefined> = isVertical
    ? state => state.vertical.autoComplete?.results
    : state => state.universal.autoComplete?.results;
  const autocompleteResults = useAnswersState(mapStateToAutocompleteResults) || [];
  const isLoading = useAnswersState(state => state.vertical.searchLoading || state.universal.searchLoading);

  const screenReaderInstructions = instructions
    ?? 'When autocomplete results are available, use up and down arrows to review and enter to select.'

  function executeAutocomplete () {
    isVertical 
      ? answersActions.executeVerticalAutoComplete()
      : answersActions.executeUniversalAutoComplete()
  }

  function executeQuery () {
    isVertical 
      ? answersActions.executeVerticalQuery()
      : answersActions.executeUniversalQuery();
  }

  function renderSearchButton () {
    return (
      <button
        className='SearchBar__submitButton'
        onClick={executeQuery}
      >
        {isLoading
          ? <LoadingIndicator />
          : <MagnifyingGlassIcon />}
      </button>
    )
  }

  return (
    <div className='SearchBar'>
      <InputDropdown
        inputValue={query}
        placeholder={placeholder}
        screenReaderInstructions={screenReaderInstructions}
        screenReaderInstructionsId='SearchBar__srInstructions'
        hasAutocompleteCount={true}
        options={autocompleteResults.map(result => {
          return {
            value: result.value,
            render: () => renderWithHighlighting(result)
          }
        })}
        optionIdPrefix='Autocomplete__option'
        onSubmit={executeQuery}
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
          inputElement: 'SearchBar__input',
          inputContainer: 'SearchBar__inputContainer',
          screenReaderInstructions: 'ScreenReader__instructions',
          screenReaderCount: 'ScreenReader__count'
        }}
      />
    </div>
  )
}