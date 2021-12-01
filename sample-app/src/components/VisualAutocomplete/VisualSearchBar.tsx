import { useAnswersActions, useAnswersState, UniversalLimit } from '@yext/answers-headless-react';
import { Children, PropsWithChildren, isValidElement, ReactNode, useMemo } from 'react';
import InputDropdown from '../InputDropdown';
import '../../sass/SearchBar.scss';
import '../../sass/Autocomplete.scss';
import DropdownSection from '../DropdownSection';
import { useVisualEntities } from '../../hooks/useVisualEntities';
import SearchButton from '../SearchButton';
import renderWithHighlighting from '../utils/renderWithHighlighting';
import VisualAutocompleteEntities from './VisualAutocompleteEntities';
import { VisualAutocompleteSection, VisualAutocompleteSectionProps } from './VisualAutocompleteSection';
import { processTranslation } from '../utils/processTranslation';
import { useSynchronizedRequest } from '../../hooks/useSynchronizedRequest';
import useNearMeSearch from '../../hooks/useNearMeSearch';

const SCREENREADER_INSTRUCTIONS = 'When autocomplete results are available, use up and down arrows to review and enter to select.'

interface Props {
  placeholder?: string,
  geolocationOptions?: PositionOptions,
  screenReaderInstructionsId: string,
  headlessId: string,
  // The visual entities debouncing time in milliseconds
  debounceTime: number
}

/**
 * Renders a SearchBar with visual autocomplete.
 */
export default function VisualSearchBar({
  children,
  placeholder,
  screenReaderInstructionsId,
  headlessId,
  debounceTime = 500
}: PropsWithChildren<Props>) {
  const answersActions = useAnswersActions();
  const query = useAnswersState(state => state.query.input) ?? '';
  const isLoading = useAnswersState(state => state.searchStatus.isLoading) ?? false;
  const [visualAutocompleteState, executeVisualEntitiesQuery] = useVisualEntities(headlessId, debounceTime);
  const { verticalResultsArray, isLoading: autocompleteLoading } = visualAutocompleteState;

  const [ executeQuery, autocompletePromiseRef ] = useNearMeSearch(answersActions)

  const [autocompleteResponse, executeAutocomplete] = useSynchronizedRequest(async () => {
    return answersActions.executeUniversalAutocomplete();
  });

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

  const restrictedVerticals = useMemo(() => calculateRestrictedVerticals(children), [children]);
  const universalLimit = useMemo(() => calculateUniversalLimits(children), [children]);
  // TODO: add restrictedVerticals to answers-headless and use it here in next PR

  function renderDropdownSection() {
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
        screenReaderText={screenReaderText}
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
        {options.length > 0 && renderDropdownSection()}
        {verticalResultsArray.length > 0 &&
          <div style={{ opacity: autocompleteLoading ? 0.5 : 1 }}>
            <VisualAutocompleteEntities verticalResultsArray={verticalResultsArray}>
              {children}
            </VisualAutocompleteEntities>
          </div>
        }
      </InputDropdown>
    </div>
  )
}

/**
 * Calculates the restrictedVerticals query param from VisualAutocompleteSection children.
 */
function calculateRestrictedVerticals(children: ReactNode): string[] {
  const restrictedVerticalsSet = Children.toArray(children).reduce<Set<string>>((verticalKeySet, child) => {
    if (isValidElement(child) && child.type === VisualAutocompleteSection) {
      const childProps = child.props as VisualAutocompleteSectionProps;
      verticalKeySet.add(childProps.verticalKey);
    }
    return verticalKeySet;
  }, new Set());
  return Array.from(restrictedVerticalsSet);
}

/**
 * Calculates the universalLimit query param from VisualAutocompleteSection children.
 */
function calculateUniversalLimits(children: ReactNode): UniversalLimit {
  return Children.toArray(children).reduce<UniversalLimit>((universalLimit, child) => {
    if (isValidElement(child) && child.type === VisualAutocompleteSection) {
      const childProps = child.props as VisualAutocompleteSectionProps;
      const { verticalKey, limit } = childProps;
      universalLimit[verticalKey] = limit ?? 5;
    }
    return universalLimit;
  }, {});
}