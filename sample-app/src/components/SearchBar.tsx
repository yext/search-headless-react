import { useAnswersActions, useAnswersState, StateMapper } from '@yext/answers-headless-react';
import { AutocompleteResult } from '@yext/answers-core';
import InputDropdown from './InputDropdown';
import renderWithHighlighting from './utils/renderWithHighlighting';
import { ReactComponent as MagnifyingGlassIcon } from '../icons/magnifying_glass.svg';
import searchBarStyles from '../sass/SearchBar.module.scss';
import { composeTheme } from '@css-modules-theme/core';
import { Compose, Theme } from '@css-modules-theme/core';

interface Props {
  placeholder?: string
  isVertical: boolean
  theme?: SearchBarTheme
  themeCompose?: 'merge' | 'assign' | 'replace'
}

interface SearchBarTheme {
  root?: string
  optionContainer?: string
  option?: string
  option__focused?: string
  inputElement?: string
  inputContainer?: string
  submitButton?: string
}

/**
 * Renders a SearchBar that is hooked up with an Autocomplete component
 */
export default function SearchBar({ placeholder, isVertical, theme = {}, themeCompose = 'merge' }: Props) {
  const compose = 
    themeCompose === 'merge' ? Compose.Merge :
    themeCompose === 'assign' ? Compose.Assign : Compose.Replace
  const finalTheme = composeTheme([{ theme: theme as Theme, compose }, { theme: searchBarStyles }]) as Required<SearchBarTheme>


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
        className={finalTheme.submitButton}
        onClick={() => {
          answersActions.executeVerticalQuery();
        }}
      >
        <MagnifyingGlassIcon/>
      </button>
    )
  }

  return (
    <div className={finalTheme.root}>
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
        theme={finalTheme}
      />
    </div>
  )
}