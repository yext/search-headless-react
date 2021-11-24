import { useAnswersActions, useAnswersState } from '@yext/answers-headless-react';
import InputDropdown from './InputDropdown';
import renderWithHighlighting from './utils/renderWithHighlighting';
import { ReactComponent as MagnifyingGlassIcon } from '../icons/magnifying_glass.svg';
import '../sass/SearchBar.scss';
import '../sass/Autocomplete.scss';
import LoadingIndicator from './LoadingIndicator';
import { useAutocomplete } from '../hooks/useAutocomplete';
import DropdownSection from './DropdownSection';
import { processTranslation } from './utils/processTranslation';
import { useRef } from 'react';
import { AutocompleteResponse, SearchIntent } from '@yext/answers-headless';
import { executeSearch, updateLocationIfNeeded } from '../utils/search-operations';

const SCREENREADER_INSTRUCTIONS = 'When autocomplete results are available, use up and down arrows to review and enter to select.'

interface Props {
  placeholder?: string,
  isVertical: boolean,
  geolocationOptions?: PositionOptions,
  screenReaderInstructionsId: string
}

/**
 * Renders a SearchBar that is hooked up with an Autocomplete component
 */
export default function SearchBar({
  placeholder,
  isVertical,
  geolocationOptions,
  screenReaderInstructionsId 
}: Props) {
  const answersActions = useAnswersActions();
  const query = useAnswersState(state => state.query.input);
  const isLoading = useAnswersState(state => state.searchStatus.isLoading);
  /**
   * Allow a query search to wait on the response to the autocomplete request right
   * before the search execution in order to retrieve the search intents
   */
  const autocompletePromiseRef = useRef<Promise<AutocompleteResponse|undefined>>();
  const [ autocompleteResponse, executeAutocomplete] = useAutocomplete(isVertical);

  const options = autocompleteResponse?.results.map(result => {
    return {
      value: result.value,
      display: renderWithHighlighting(result)
    }
  }) ?? [];

  const screenReaderText = processTranslation({
    phrase: `${options.length} autocomplete option found.`,
    pluralForm: `${options.length} autocomplete options found.`,
    count: options.length
  });

  async function executeQuery () {
    let intents: SearchIntent[] = [];
    if (!answersActions.state.location.userLocation) {
      const autocompleteResponseBeforeSearch = await autocompletePromiseRef.current;
      intents = autocompleteResponseBeforeSearch?.inputIntents || [];
      await updateLocationIfNeeded(answersActions, intents, geolocationOptions);
    }
    executeSearch(answersActions, isVertical);
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
        onInputChange={value => {
          answersActions.setQuery(value);
        }}
        onInputFocus={() => {
          autocompletePromiseRef.current = executeAutocomplete();
        }}
        renderButtons={renderSearchButton}
        cssClasses={{
          dropdownContainer: 'Autocomplete',
          inputElement: 'SearchBar__input',
          inputContainer: 'SearchBar__inputContainer'
        }}
      >
        {
          options.length > 0 &&
          <DropdownSection
            options={options}
            optionIdPrefix={'Autocomplete__option-0'}
            onFocusChange={value => {
              answersActions.setQuery(value);
            }}
            onClickOption={option => {
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
        }
      </InputDropdown>
    </div>
  )
}