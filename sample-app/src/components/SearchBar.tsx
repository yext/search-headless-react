import { useAnswersActions, useAnswersState } from '@yext/answers-headless-react';
import InputDropdown from './InputDropdown';
import renderWithHighlighting from './utils/renderWithHighlighting';
import { ReactComponent as MagnifyingGlassIcon } from '../icons/magnifying_glass.svg';
import '../sass/SearchBar.scss';
import '../sass/Autocomplete.scss';
import LoadingIndicator from './LoadingIndicator';
import { useAutocomplete } from '../hooks/useAutocomplete';
import SearchHandler from '../utils/searchhandler';
import { SearchIntent } from '@yext/answers-headless';

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
  const [ 
    autocompleteResponse,
    responseToLatestRequestRef,
    executeAutocomplete
  ] = useAutocomplete(isVertical);

  async function executeQuery () {
    const responseToLatestRequest = await responseToLatestRequestRef.current;
    if (responseToLatestRequest?.inputIntents.includes(SearchIntent.NearMe)) {
      try {
        const position = await SearchHandler.getUserLocation(geolocationOptions);
        answersActions.setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      } catch(e) {
        console.error(e);
      }
    }
    SearchHandler.executeSearch(answersActions, isVertical);
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
          executeAutocomplete();
        }}
        renderButtons={renderSearchButton}
        cssClasses={{
          optionContainer: 'Autocomplete',
          option: 'Autocomplete__option',
          focusedOption: 'Autocomplete__option--focused',
          inputElement: 'SearchBar__input',
          inputContainer: 'SearchBar__inputContainer'
        }}
      />
    </div>
  )
}