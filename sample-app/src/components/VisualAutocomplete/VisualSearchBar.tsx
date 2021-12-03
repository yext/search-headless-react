import { useAnswersActions, useAnswersState, UniversalLimit, VerticalResults, AutocompleteResponse, AutocompleteResult } from '@yext/answers-headless-react';
import { Children, PropsWithChildren, isValidElement, ReactNode, useMemo } from 'react';
import InputDropdown from '../InputDropdown';
import '../../sass/SearchBar.scss';
import '../../sass/Autocomplete.scss';
import DropdownSection from '../DropdownSection';
import { useVisualEntities } from '../../hooks/useVisualEntities';
import SearchButton from '../SearchButton';
import renderWithHighlighting from '../utils/renderWithHighlighting';
import VisualAutocompleteEntities from './VisualAutocompleteEntities';
import { VisualAutocompleteSection, VisualAutocompleteSectionProps, VisualEntities, VisualEntitiesProps } from './VisualEntities';
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
  debounceTime: number,
  // children: (autocompleteDropdown: JSX.Element) => JSX.Element
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
  const autocompleteResults = autocompleteResponse?.results || [];

  function renderDropdownSection() {
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
    />
  }

  const content = children(renderDropdownSection())
  const verticalKeyToResults = verticalResultsArrayToMapping(verticalResultsArray);
  const restrictedVerticals = new Set<string>();
  const universalLimit: UniversalLimit = {};
  Children.toArray(content).map(c => {
    if (!isValidElement(c) || c.type !== VisualEntities) {
      return c;
    }
    const childProps: VisualEntitiesProps = c.props;
    const { verticalKey, limit, children } = childProps;
    const results = verticalKeyToResults[verticalKey]
    restrictedVerticals.add(childProps.verticalKey);
    universalLimit[verticalKey] = limit ?? 5;
    return children(results.results);
  });

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
 * @returns a mapping of vertical key to VerticalResults
 */
function verticalResultsArrayToMapping(verticalResultsArray: VerticalResults[]): Record<string, VerticalResults> {
  return verticalResultsArray.reduce<Record<string, VerticalResults>>((prev, current) => {
    prev[current.verticalKey] = current;
    return prev;
  }, {});
}

function getScreenReaderText(options: AutocompleteResult[]) {
  return processTranslation({
    phrase: `${options.length} autocomplete option found.`,
    pluralForm: `${options.length} autocomplete options found.`,
    count: options.length
  });
}