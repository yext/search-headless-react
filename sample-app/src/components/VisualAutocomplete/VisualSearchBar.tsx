import { useAnswersActions, useAnswersState, VerticalResults, AutocompleteResult } from '@yext/answers-headless-react';
import {  PropsWithChildren } from 'react';
import InputDropdown from '../InputDropdown';
import '../../sass/SearchBar.scss';
import '../../sass/Autocomplete.scss';
import DropdownSection from '../DropdownSection';
import { useVisualEntities } from '../../hooks/useVisualEntities';
import SearchButton from '../SearchButton';
import renderWithHighlighting from '../utils/renderWithHighlighting';
import { processTranslation } from '../utils/processTranslation';
import { useSynchronizedRequest } from '../../hooks/useSynchronizedRequest';
import { calculateUniversalLimit, transformVisualEntities } from './VisualEntities';
import useSearchWithNearMeHandling from '../../hooks/useSearchWithNearMeHandling';

const SCREENREADER_INSTRUCTIONS = 'When autocomplete results are available, use up and down arrows to review and enter to select.'

type RenderVisualEntities = (
  autocompleteLoading: boolean,
  verticalResultsArray: VerticalResults[]
) => JSX.Element;

interface Props {
  placeholder?: string,
  geolocationOptions?: PositionOptions,
  screenReaderInstructionsId: string,
  headlessId: string,
  // The visual entities debouncing time in milliseconds
  debounceTime: number,
  renderVisualEntities: RenderVisualEntities,
  children: (autocompleteDropdown: JSX.Element | null, visualEntities: JSX.Element | null) => JSX.Element
}

/**
 * Renders a SearchBar with visual autocomplete.
 */
export default function VisualSearchBar({
  children,
  placeholder,
  screenReaderInstructionsId,
  headlessId,
  renderVisualEntities,
  debounceTime = 500
}: PropsWithChildren<Props>) {
  const answersActions = useAnswersActions();
  const query = useAnswersState(state => state.query.input) ?? '';
  const isLoading = useAnswersState(state => state.searchStatus.isLoading) ?? false;
  const [visualAutocompleteState, executeVisualEntitiesQuery] = useVisualEntities(headlessId, debounceTime);
  const { verticalResultsArray, isLoading: visualEntitiesLoading } = visualAutocompleteState;
  const [executeQuery, autocompletePromiseRef] = useSearchWithNearMeHandling(answersActions)
  const [autocompleteResponse, executeAutocomplete] = useSynchronizedRequest(async () => {
    return answersActions.executeUniversalAutocomplete();
  });
  const autocompleteResults = autocompleteResponse?.results || [];
  const visualEntities = renderVisualEntities(visualEntitiesLoading, verticalResultsArray);
  const universalLimit = calculateUniversalLimit(visualEntities);

  function renderDropdownSection() {
    if (autocompleteResults.length === 0) {
      return null;
    }
    const options = autocompleteResults.map(result => {
      return {
        value: result.value,
        display: renderWithHighlighting(result)
      }
    }) ?? [];

    return <DropdownSection
      options={options}
      optionIdPrefix='VisualAutocompleteOption_0'
      onFocusChange={value => {
        answersActions.setQuery(value);
        executeVisualEntitiesQuery(value, universalLimit);
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

  return (
    <div className='SearchBar'>
      <InputDropdown
        inputValue={query}
        placeholder={placeholder}
        screenReaderInstructions={SCREENREADER_INSTRUCTIONS}
        screenReaderInstructionsId={screenReaderInstructionsId}
        screenReaderText={getScreenReaderText(autocompleteResults)}
        onSubmit={executeQuery}
        onInputChange={value => {
          answersActions.setQuery(value);
          executeVisualEntitiesQuery(value, universalLimit);
        }}
        onInputFocus={() => {
          autocompletePromiseRef.current = executeAutocomplete();
        }}
        renderButtons={() =>
          <SearchButton
            className='SearchBar__submitButton'
            handleClick={executeQuery}
            isLoading={isLoading}
          />
        }
        cssClasses={{
          dropdownContainer: 'Autocomplete',
          inputElement: 'SearchBar__input',
          inputContainer: 'SearchBar__inputContainer'
        }}
      >
        {children(renderDropdownSection(), transformVisualEntities(visualEntities, verticalResultsArray))}
      </InputDropdown>
    </div>
  )
}

function getScreenReaderText(options: AutocompleteResult[]) {
  return processTranslation({
    phrase: `${options.length} autocomplete option found.`,
    pluralForm: `${options.length} autocomplete options found.`,
    count: options.length
  });
}