import { AutocompleteResult, useAnswersActions, useAnswersState } from '@yext/answers-headless-react';
import InputDropdown, { InputDropdownCssClasses } from './InputDropdown';
import renderHighlightedValue from './utils/renderHighlightedValue';
import { ReactComponent as MagnifyingGlassIcon } from '../icons/magnifying_glass.svg';
import { ReactComponent as YextLogoIcon } from '../icons/yext_logo.svg';
import LoadingIndicator from './LoadingIndicator';
import { useSynchronizedRequest } from '../hooks/useSynchronizedRequest';
import DropdownSection, { DropdownSectionCssClasses } from './DropdownSection';
import { processTranslation } from './utils/processTranslation';
import { useRef } from 'react';
import { AutocompleteResponse, SearchIntent } from '@yext/answers-headless-react';
import { executeSearch, updateLocationIfNeeded } from '../utils/search-operations';
import { useComposedCssClasses, CompositionMethod } from '../hooks/useComposedCssClasses';

const SCREENREADER_INSTRUCTIONS = 'When autocomplete results are available, use up and down arrows to review and enter to select.'

const builtInCssClasses: SearchBarCssClasses = {
  container: 'h-12',
  divider: 'border mx-2',
  dropdownContainer: 'relative bg-white py-1 z-10',
  focusedOption: 'bg-gray-100',
  inputContainer: 'h-12 inline-flex items-center justify-between w-full',
  inputDropdownContainer: 'bg-white shadow border rounded-3xl border-gray-300 w-full overflow-hidden',
  inputElement: 'outline-none flex-grow border-none h-full px-2',
  logoContainer: 'w-8 mx-2',
  option: 'flex items-center py-1 px-2 cursor-pointer',
  resultIconContainer: 'opacity-20 w-8 h-8 pl-1 mr-4',
  searchButtonContainer: 'w-8 h-full mx-2',
  submitButton: 'h-full w-full'
}

interface SearchBarCssClasses extends InputDropdownCssClasses, DropdownSectionCssClasses {
  container?: string,
  inputDropdownContainer?: string,
  resultIconContainer?: string,
  submitButton?: string
}

interface Props {
  placeholder?: string,
  isVertical: boolean,
  geolocationOptions?: PositionOptions,
  screenReaderInstructionsId: string,
  customCssClasses?: SearchBarCssClasses,
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
  customCssClasses,
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
  const [autocompleteResponse, executeAutocomplete] = useSynchronizedRequest(() => {
    return isVertical
      ? answersActions.executeVerticalAutocomplete()
      : answersActions.executeUniversalAutocomplete();
  });

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

  /**
   * Renders an autocomplete result including the icon to the left
   * @param result The result to render
   * @returns JSX.Element
   */
  function renderAutocompleteResult (result: AutocompleteResult) {
    return <>
      <div className={cssClasses.resultIconContainer}>
        <MagnifyingGlassIcon/>
      </div>
      <div>
        {renderHighlightedValue(result)}
      </div>
    </>
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
          onlyAllowDropdownOptionSubmissions={false}
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
              onSelectOption={optionValue => {
                answersActions.setQuery(optionValue);
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