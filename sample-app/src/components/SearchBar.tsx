import { useAnswersActions, useAnswersState, StateSelector, AutocompleteResult } from '@yext/answers-headless-react';
import InputDropdown from './InputDropdown';
import renderWithHighlighting from './utils/renderWithHighlighting';
import { ReactComponent as MagnifyingGlassIcon } from '../icons/magnifying_glass.svg';
import { ReactComponent as YextLogoIcon } from '../icons/yext_logo.svg';
import LoadingIndicator from './LoadingIndicator';
import { composeCssClasses, Composition } from '../utils/composeCssClasses';

const SCREENREADER_INSTRUCTIONS = 'When autocomplete results are available, use up and down arrows to review and enter to select.'

interface SearchBarCssClasses {
  dropdownContainer?: string,
  option?: string,
  focusedOption?: string, 
  inputElement?: string,
  inputContainer?: string,
  iconContainer?: string,
  buttonContainer?: string,
  submitButton?: string
}

const builtInCssClasses: SearchBarCssClasses = {
  inputContainer: 'h-12 inline-flex items-center justify-between bg-white shadow border rounded-full border-gray-300 w-full',
  inputElement: 'flex-grow border-none h-full px-2',
  iconContainer: 'w-8 mx-2',
  buttonContainer: 'w-8 h-full mx-2',
  submitButton: 'h-full w-full',
  dropdownContainer: 'absolute rounded-b-lg bg-white w-max mx-12 border shadow',
  option: 'py-2 px-2 cursor-pointer',
  focusedOption: 'bg-gray-100'
}

interface Props {
  placeholder?: string,
  isVertical: boolean,
  screenReaderInstructionsId: string,
  cssClasses?: SearchBarCssClasses,
  cssComposition?: Composition
}

/**
 * Renders a SearchBar that is hooked up with an Autocomplete component
 */
export default function SearchBar({ placeholder, isVertical, screenReaderInstructionsId, cssClasses }: Props) {
  const classes = composeCssClasses(builtInCssClasses, cssClasses);
  const answersActions = useAnswersActions();
  const query = useAnswersState(state => state.query.query);
  const mapStateToAutocompleteResults: StateSelector<AutocompleteResult[] | undefined> = isVertical
    ? state => state.vertical.autoComplete?.results
    : state => state.universal.autoComplete?.results;
  const autocompleteResults = useAnswersState(mapStateToAutocompleteResults) || [];
  const isLoading = useAnswersState(state => state.vertical.searchLoading || state.universal.searchLoading);

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
        className={classes.submitButton}
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
        screenReaderInstructions={SCREENREADER_INSTRUCTIONS}
        screenReaderInstructionsId={screenReaderInstructionsId}
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
        renderIcon={() => <YextLogoIcon />}
        renderButtons={renderSearchButton}
        cssClasses={classes}
      />
    </div>
  )
}