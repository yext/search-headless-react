import { useAnswersActions, useAnswersState, VerticalResults, AutocompleteResult } from '@yext/answers-headless-react';
import { PropsWithChildren } from 'react';
import InputDropdown from '../InputDropdown';
import '../../sass/Autocomplete.scss';
import DropdownSection from '../DropdownSection';
import { useEntityPreviews } from '../../hooks/useEntityPreviews';
import SearchButton from '../SearchButton';
import { processTranslation } from '../utils/processTranslation';
import { useSynchronizedRequest } from '../../hooks/useSynchronizedRequest';
import { calculateUniversalLimit, transformEntityPreviews } from './EntityPreview';
import useSearchWithNearMeHandling from '../../hooks/useSearchWithNearMeHandling';
import { builtInCssClasses, SearchBarCssClasses } from '../SearchBar';
import { CompositionMethod, useComposedCssClasses } from '../../hooks/useComposedCssClasses';
import { ReactComponent as YextLogoIcon } from '../../icons/yext_logo.svg';
import renderAutocompleteResult from '../utils/renderAutocompleteResult';

const SCREENREADER_INSTRUCTIONS = 'When autocomplete results are available, use up and down arrows to review and enter to select.'

type RenderEntityPreviews = (
  autocompleteLoading: boolean,
  verticalResultsArray: VerticalResults[]
) => JSX.Element;

interface Props {
  placeholder?: string,
  geolocationOptions?: PositionOptions,
  screenReaderInstructionsId: string,
  headlessId: string,
  // The debouncing time, in milliseconds, for making API requests for entity previews
  entityPreviewsDebouncingTime: number,
  renderEntityPreviews?: RenderEntityPreviews,
  customCssClasses?: SearchBarCssClasses,
  cssCompositionMethod?: CompositionMethod
}

/**
 * Renders a SearchBar with visual autocomplete.
 */
export default function VisualSearchBar({
  placeholder,
  screenReaderInstructionsId,
  headlessId,
  renderEntityPreviews,
  customCssClasses,
  cssCompositionMethod,
  entityPreviewsDebouncingTime = 500
}: PropsWithChildren<Props>) {
  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses, cssCompositionMethod);

  const answersActions = useAnswersActions();
  const query = useAnswersState(state => state.query.input) ?? '';
  const isLoading = useAnswersState(state => state.searchStatus.isLoading) ?? false;
  const [executeQuery, autocompletePromiseRef] = useSearchWithNearMeHandling(answersActions)
  const [autocompleteResponse, executeAutocomplete] = useSynchronizedRequest(async () => {
    return answersActions.executeUniversalAutocomplete();
  });

  const [entityPreviewsState, executeEntityPreviewQuery] = useEntityPreviews(headlessId, entityPreviewsDebouncingTime);
  const { verticalResultsArray, isLoading: entityPreviewsLoading } = entityPreviewsState;
  const autocompleteResults = autocompleteResponse?.results || [];
  const entityPreviews = renderEntityPreviews && renderEntityPreviews(entityPreviewsLoading, verticalResultsArray);
  function updateEntityPreviews(query: string) {
    if (!renderEntityPreviews) {
      return;
    }
    const universalLimit = calculateUniversalLimit(entityPreviews);
    executeEntityPreviewQuery(query, universalLimit);
  }

  function renderQuerySuggestions() {
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
      optionIdPrefix='VisualSearchBar-QuerySuggestions'
      onFocusChange={value => {
        answersActions.setQuery(value);
        updateEntityPreviews(value);
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
            updateEntityPreviews(value);
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
          hideDropdown={autocompleteResults.length === 0 && verticalResultsArray.length === 0}
        >
          {renderQuerySuggestions()}
          {entityPreviews && transformEntityPreviews(entityPreviews, verticalResultsArray)}
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