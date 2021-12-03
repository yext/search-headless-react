import { useAnswersActions, useAnswersState, VerticalResults, AutocompleteResult } from '@yext/answers-headless-react';
import { PropsWithChildren } from 'react';
import InputDropdown from '../InputDropdown';
import '../../sass/Autocomplete.scss';
import DropdownSection from '../DropdownSection';
import { useVisualEntities } from '../../hooks/useVisualEntities';
import SearchButton from '../SearchButton';
import { processTranslation } from '../utils/processTranslation';
import { useSynchronizedRequest } from '../../hooks/useSynchronizedRequest';
import { calculateUniversalLimit, transformVisualEntities } from './VisualEntities';
import useSearchWithNearMeHandling from '../../hooks/useSearchWithNearMeHandling';
import { builtInCssClasses, SearchBarCssClasses } from '../SearchBar';
import { CompositionMethod, useComposedCssClasses } from '../../hooks/useComposedCssClasses';
import { ReactComponent as YextLogoIcon } from '../../icons/yext_logo.svg';
import renderAutocompleteResult from '../utils/renderAutocompleteResult';

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
  children: (autocompleteDropdown: JSX.Element | null, visualEntities: JSX.Element | null) => JSX.Element,
  customCssClasses?: SearchBarCssClasses,
  cssCompositionMethod?: CompositionMethod
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
  customCssClasses,
  cssCompositionMethod,
  debounceTime = 500
}: PropsWithChildren<Props>) {
  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses, cssCompositionMethod);

  const answersActions = useAnswersActions();
  const query = useAnswersState(state => state.query.input) ?? '';
  const isLoading = useAnswersState(state => state.searchStatus.isLoading) ?? false;
  const [executeQuery, autocompletePromiseRef] = useSearchWithNearMeHandling(answersActions)
  const [autocompleteResponse, executeAutocomplete] = useSynchronizedRequest(async () => {
    return answersActions.executeUniversalAutocomplete();
  });

  const [visualAutocompleteState, executeVisualEntitiesQuery] = useVisualEntities(headlessId, debounceTime);
  const { verticalResultsArray, isLoading: visualEntitiesLoading } = visualAutocompleteState;
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
        display: renderAutocompleteResult(result, cssClasses.resultIconContainer)
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
      cssClasses={cssClasses}
    />
  }

  return (
    <div className={cssClasses.container}>
      <div className={cssClasses.inputDropdownContainer}>
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
          renderSearchButton={() =>
            <SearchButton
              className={cssClasses.submitButton}
              handleClick={executeQuery}
              isLoading={isLoading}
            />
          }
          renderLogo={() => <YextLogoIcon />}
          cssClasses={cssClasses}
        >
          {children(renderDropdownSection(), transformVisualEntities(visualEntities, verticalResultsArray))}
        </InputDropdown>
      </div>
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