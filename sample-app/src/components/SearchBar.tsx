import { useAnswersActions, useAnswersState } from '@yext/answers-headless-react';
import InputDropdown from './InputDropdown';
import renderWithHighlighting from './utils/renderWithHighlighting';
import { ReactComponent as MagnifyingGlassIcon } from '../icons/magnifying_glass.svg';
import { ReactComponent as YextLogoIcon } from '../icons/yext_logo.svg';
import LoadingIndicator from './LoadingIndicator';
import { useAutocomplete } from '../hooks/useAutocomplete';
import { useRef } from 'react';
import { AutocompleteResponse, SearchIntent } from '@yext/answers-headless';
import { executeSearch, updateLocationIfNeeded } from '../utils/search-operations';
import { composeCssClasses, CompositionMethod } from '../utils/composeCssClasses';

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
  const classes = composeCssClasses(builtInCssClasses, customCssClasses, cssCompositionMethod);
  const answersActions = useAnswersActions();
  const query = useAnswersState(state => state.query.input);
  const isLoading = useAnswersState(state => state.searchStatus.isLoading);
  /**
   * Allow a query search to wait on the response to the autocomplete request right
   * before the search execution in order to retrieve the search intents
   */
  const autocompletePromiseRef = useRef<Promise<AutocompleteResponse|undefined>>();
  const [ autocompleteResponse, executeAutocomplete] = useAutocomplete(isVertical);

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
        options={autocompleteResponse?.results.map(result => {
          return {
            value: result.value,
            render: () => renderWithHighlighting(result)
          }
        }) ?? []}
        optionIdPrefix='Autocomplete__option'
        onSubmit={executeQuery}
        updateInputValue={value => {
          answersActions.setQuery(value);
        }}
        updateDropdown={() => {
          autocompletePromiseRef.current = executeAutocomplete();
        }}
        renderIcon={() => <YextLogoIcon />}
        renderButtons={renderSearchButton}
        cssClasses={classes}
      />
    </div>
  )
}