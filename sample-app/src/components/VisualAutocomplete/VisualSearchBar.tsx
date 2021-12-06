import { useAnswersActions, useAnswersState, VerticalResults, AutocompleteResult } from '@yext/answers-headless-react';
import { PropsWithChildren, useMemo } from 'react';
import InputDropdown from '../InputDropdown';
import '../../sass/Autocomplete.scss';
import DropdownSection from '../DropdownSection';
import { useEntityPreviews } from '../../hooks/useEntityPreviews';
import SearchButton from '../SearchButton';
import { processTranslation } from '../utils/processTranslation';
import { useSynchronizedRequest } from '../../hooks/useSynchronizedRequest';
import { calculateUniversalLimit, transformEntityPreviews } from './EntityPreviews';
import useSearchWithNearMeHandling from '../../hooks/useSearchWithNearMeHandling';
import { builtInCssClasses, SearchBarCssClasses } from '../SearchBar';
import { CompositionMethod, useComposedCssClasses } from '../../hooks/useComposedCssClasses';
import { ReactComponent as YextLogoIcon } from '../../icons/yext_logo.svg';
import { ReactComponent as RecentSearchIcon } from '../../icons/history.svg';
import renderAutocompleteResult from '../utils/renderAutocompleteResult';
import RecentSearches from "recent-searches";

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
  hideRecentSearches?: boolean,
  recentSearchesLimit?: number,
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
  hideRecentSearches=false,
  renderEntityPreviews,
  recentSearchesLimit=5,
  customCssClasses,
  cssCompositionMethod,
  entityPreviewsDebouncingTime = 500
}: PropsWithChildren<Props>) {
  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses, cssCompositionMethod);

  const answersActions = useAnswersActions();
  const query = useAnswersState(state => state.query.input) ?? '';
  const isLoading = useAnswersState(state => state.searchStatus.isLoading) ?? false;
  const [executeQueryWithNearMeHandling, autocompletePromiseRef] = useSearchWithNearMeHandling(answersActions)
  const [autocompleteResponse, executeAutocomplete] = useSynchronizedRequest(async () => {
    return answersActions.executeUniversalAutocomplete();
  });
  const recentSearches = useMemo(() => {
    return hideRecentSearches 
      ? undefined
      : new RecentSearches({ limit: recentSearchesLimit })
  }, [recentSearchesLimit, hideRecentSearches]);

  function executeQuery() {
    if (!hideRecentSearches) {
      let input = answersActions.state.query.input;
      input && recentSearches?.setRecentSearch(input);
    }
    executeQueryWithNearMeHandling();
  }

  const [entityPreviewsState, executeEntityPreviewsQuery] = useEntityPreviews(headlessId, entityPreviewsDebouncingTime);
  const { verticalResultsArray, isLoading: entityPreviewsLoading } = entityPreviewsState;
  const autocompleteResults = autocompleteResponse?.results || [];
  const entityPreviews = renderEntityPreviews && renderEntityPreviews(entityPreviewsLoading, verticalResultsArray);
  function updateEntityPreviews(query: string) {
    if (!renderEntityPreviews) {
      return;
    }
    const universalLimit = calculateUniversalLimit(entityPreviews);
    executeEntityPreviewsQuery(query, universalLimit);
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

  function renderRecentSearches() {
    const options = recentSearches?.getRecentSearches().map(result => {
      return {
        value: result.query,
        display: (
          <div className='flex items-center'>
            <RecentSearchIcon />
            <div className='ml-1'>{result.query}</div>
          </div>
        )
      }
    }) ?? [];

    return <DropdownSection
      options={options}
      optionIdPrefix='VisualSearchBar-RecentSearches'
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
          onInputFocus={value => {
            updateEntityPreviews(value);
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
          {!hideRecentSearches && renderRecentSearches()}
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