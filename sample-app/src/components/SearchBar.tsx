import { AutocompleteResult, useAnswersActions, useAnswersState } from '@yext/answers-headless-react';
import InputDropdown from './InputDropdown';
import renderHighlightedValue from './utils/renderHighlightedValue';
import { ReactComponent as MagnifyingGlassIcon } from '../icons/magnifying_glass.svg';
import { ReactComponent as YextLogoIcon } from '../icons/yext_logo.svg';
import LoadingIndicator from './LoadingIndicator';
import { useAutocomplete } from '../hooks/useAutocomplete';
import DropdownSection from './DropdownSection';
import { processTranslation } from './utils/processTranslation';
import { useRef } from 'react';
import { AutocompleteResponse, SearchIntent } from '@yext/answers-headless-react';
import { executeSearch, updateLocationIfNeeded } from '../utils/search-operations';
import { useComposedCssClasses, CompositionMethod } from '../utils/useComposedCssClasses';

const SCREENREADER_INSTRUCTIONS = 'When autocomplete results are available, use up and down arrows to review and enter to select.'

interface SearchBarCssClasses {
  inputDropdownContainer?: string,
  dropdownContainer?: string,
  option?: string,
  inputElement?: string,
  inputContainer?: string,
  logoContainer?: string,
  searchButtonContainer?: string,
  submitButton?: string,
  container?: string,
  divider?: string,
  resultIconContainer?: string,
  sectionContainer?: string,
  sectionLabel?: string,
  optionsContainer?: string,
  focusedOption?: string
}

const builtInCssClasses: SearchBarCssClasses = {
  container: 'h-12',
  inputDropdownContainer: 'bg-white shadow border rounded-3xl border-gray-300 w-full overflow-hidden',
  inputContainer: 'h-12 inline-flex items-center justify-between w-full',
  inputElement: 'outline-none flex-grow border-none h-full px-2',
  logoContainer: 'w-8 mx-2',
  searchButtonContainer: 'w-8 h-full mx-2',
  submitButton: 'h-full w-full',
  dropdownContainer: 'relative bg-white pt-2 pb-1',
  option: 'flex items-center py-1 px-2 cursor-pointer',
  focusedOption: 'bg-gray-100',
  divider: 'border mx-2',
  resultIconContainer: 'opacity-20 w-8 h-8 pl-1 mr-4'
}

interface Props {
  placeholder?: string,
  isVertical: boolean,
  geolocationOptions?: PositionOptions,
  screenReaderInstructionsId: string,
  cssClasses?: SearchBarCssClasses,
  cssCompositionMethod?: CompositionMethod
}

/**
 * Renders a SearchBar that is hooked up with an Autocomplete component
 */
export default function SearchBar({
  placeholder,
  isVertical,
  geolocationOptions,
  screenReaderInstructionsId,
  cssClasses: customCssClasses,
  cssCompositionMethod
}: Props) {
  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses, cssCompositionMethod);
  const answersActions = useAnswersActions();
  const query = useAnswersState(state => state.query.input);
  const isLoading = useAnswersState(state => state.searchStatus.isLoading);
  /**
   * Allow a query search to wait on the response to the autocomplete request right
   * before the search execution in order to retrieve the search intents
   */
  const autocompletePromiseRef = useRef<Promise<AutocompleteResponse | undefined>>();
  const [autocompleteResponse, executeAutocomplete] = useAutocomplete(isVertical);

  const options = autocompleteResponse?.results.map(result => {
    return {
      value: result.value,
      display: renderAutocompleteResult(result)
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
        className={cssClasses.submitButton}
        onClick={executeQuery}
      >
        {isLoading
          ? <LoadingIndicator />
          : <MagnifyingGlassIcon />}
      </button>
    )
  }

  function renderAutocompleteResult (result: AutocompleteResult) {
    return <>
      <div className={cssClasses.resultIconContainer}>
        < MagnifyingGlassIcon/>
      </div>
      <div>
        {renderAutocompleteValue(result)}
      </div>
    </>
  }

  function renderAutocompleteValue ({ value, matchedSubstrings }: AutocompleteResult) {
    if (!matchedSubstrings || matchedSubstrings.length === 0) {
      return <span>{value}</span>;
    }
    return renderHighlightedValue({ value, matchedSubstrings });
  }

  return (
    <div className={cssClasses.container}>
      <div className={cssClasses.inputDropdownContainer}>
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
          renderLogo={() => <YextLogoIcon />}
          renderSearchButton={renderSearchButton}
          cssClasses={cssClasses}
        >
          {
            options.length > 0 &&
            <DropdownSection
              options={options}
              optionIdPrefix='Autocomplete__option-0'
              onFocusChange={value => {
                answersActions.setQuery(value);
              }}
              onClickOption={option => {
                answersActions.setQuery(option.value);
                executeQuery();
              }}
              cssClasses={cssClasses}
            />
          }
        </InputDropdown>
      </div>
    </div>
  )
}