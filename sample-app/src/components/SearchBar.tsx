import { useAnswersActions, useAnswersState } from '@yext/answers-headless-react';
import InputDropdown from './InputDropdown';
import renderWithHighlighting from './utils/renderWithHighlighting';
import { ReactComponent as MagnifyingGlassIcon } from '../icons/magnifying_glass.svg';
import '../sass/SearchBar.scss';
import '../sass/Autocomplete.scss';
import LoadingIndicator from './LoadingIndicator';
import { useAutocomplete } from '../hooks/useAutocomplete';
import DropdownSection, { Option } from './DropdownSection';
import { processTranslation } from './utils/processTranslation';

const SCREENREADER_INSTRUCTIONS = 'When autocomplete results are available, use up and down arrows to review and enter to select.'

interface Props {
  placeholder?: string,
  isVertical: boolean,
  screenReaderInstructionsId: string
}

/**
 * Renders a SearchBar that is hooked up with an Autocomplete component
 */
export default function SearchBar({ placeholder, isVertical, screenReaderInstructionsId }: Props) {
  const answersActions = useAnswersActions();
  const query = useAnswersState(state => state.query.input);
  const [ autocompleteResults, executeAutocomplete ] = useAutocomplete(isVertical);
  const isLoading = useAnswersState(state => state.searchStatus.isLoading);

  const options = autocompleteResults.map(result => {
    return {
      value: result.value,
      display: renderWithHighlighting(result)
    }
  });

  const screenReaderText = processTranslation({
    phrase: `${options.length} autocomplete option found.`,
    pluralForm: `${options.length} autocomplete options found.`,
    count: options.length
  });

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
        screenReaderInstructions={SCREENREADER_INSTRUCTIONS}
        screenReaderInstructionsId={screenReaderInstructionsId}
        screenReaderText={screenReaderText}
        onSubmit={executeQuery}
        onInputChange={(value) => {
          answersActions.setQuery(value);
        }}
        onInputFocus={() => {
          executeAutocomplete();
        }}
        renderButtons={renderSearchButton}
        cssClasses={{
          dropdownContainer: 'Autocomplete',
          inputElement: 'SearchBar__input',
          inputContainer: 'SearchBar__inputContainer'
        }}
      >
        <DropdownSection<Option>
          options={options}
          optionIdPrefix={`Autocomplete__option-${0}`}
          onFocusChange={(value) => {
            answersActions.setQuery(value);
          }}
          onClickOption={(option) => {
            answersActions.setQuery(option.value);
            executeQuery();
          }}
          cssClasses={{
            sectionContainer: 'Autocomplete__dropdownSection',
            sectionLabel: 'Autocomplete__sectionLabel',
            optionsContainer: 'Autocomplete_sectionOptions',
            option: 'Autocomplete__option',
            focusedOption: 'Autocomplete__option--focused'
          }}
        />
      </InputDropdown>
    </div>
  )
}