import { useAnswersActions, useAnswersState } from '@yext/answers-headless-react';
import InputDropdown from './InputDropdown';
import renderWithHighlighting from './utils/renderWithHighlighting';
import '../sass/SearchBar.scss';
import '../sass/Autocomplete.scss';
import DropdownSection from './DropdownSection';
import { processTranslation } from './utils/processTranslation';
import SearchButton from './SearchButton';
import { useSynchronizedRequest } from '../hooks/useSynchronizedRequest';
import useSearchWithNearMeHandling from '../hooks/useSearchWithNearMeHandling';

const SCREENREADER_INSTRUCTIONS = 'When autocomplete results are available, use up and down arrows to review and enter to select.'

interface Props {
  placeholder?: string,
  isVertical: boolean,
  geolocationOptions?: PositionOptions,
  screenReaderInstructionsId: string
}

/**
 * Renders a SearchBar that is hooked up with an InputDropdown component
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
  const [autocompleteResponse, executeAutocomplete] = useSynchronizedRequest(() => {
    return isVertical
      ? answersActions.executeVerticalAutocomplete()
      : answersActions.executeUniversalAutocomplete();
  });
  const [ executeQuery, autocompletePromiseRef ] = useSearchWithNearMeHandling(answersActions, geolocationOptions);

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


  function renderSearchButton () {
    return <SearchButton
      className='SearchBar__submitButton'
      handleClick={executeQuery}
      isLoading={isLoading || false}
    />
  }

  return (
    <div className='SearchBar'>
      <InputDropdown
        inputValue={query}
        placeholder={placeholder}
        screenReaderInstructions={SCREENREADER_INSTRUCTIONS}
        screenReaderInstructionsId={screenReaderInstructionsId}
        screenReaderText={screenReaderText}
        onlyAllowDropdownOptionSubmissions={false}
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
        <>
          {
            options.length > 0 &&
            <DropdownSection
              options={options}
              optionIdPrefix='Autocomplete__option-0'
              onFocusChange={value => {
                answersActions.setQuery(value);
              }}
              onSelectOption={optionValue => {
                autocompletePromiseRef.current = undefined;
                answersActions.setQuery(optionValue);
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
        </>
      </InputDropdown>
    </div>
  )
}
