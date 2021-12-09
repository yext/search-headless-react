import { useAnswersActions, useAnswersState, VerticalResults, AutocompleteResult } from '@yext/answers-headless-react';
import { PropsWithChildren, useEffect } from 'react';
import InputDropdown from '../InputDropdown';
import '../../sass/Autocomplete.scss';
import DropdownSection, { Option } from '../DropdownSection';
import { useEntityPreviews } from '../../hooks/useEntityPreviews';
import SearchButton from '../SearchButton';
import { processTranslation } from '../utils/processTranslation';
import { useSynchronizedRequest } from '../../hooks/useSynchronizedRequest';
import { calculateRestrictVerticals, calculateUniversalLimit, transformEntityPreviews } from './EntityPreviews';
import useSearchWithNearMeHandling from '../../hooks/useSearchWithNearMeHandling';
import { builtInCssClasses as builtInSearchBarCssClasses, SearchBarCssClasses } from '../SearchBar';
import { CompositionMethod, useComposedCssClasses } from '../../hooks/useComposedCssClasses';
import { ReactComponent as YextLogoIcon } from '../../icons/yext_logo.svg';
import renderAutocompleteResult from '../utils/renderAutocompleteResult';
import { ReactComponent as RecentSearchIcon } from '../../icons/history.svg';
import useRecentSearches from '../../hooks/useRecentSearches';
import { useHistory } from 'react-router';
import { ReactComponent as MagnifyingGlassIcon } from '../../icons/magnifying_glass.svg';

const SCREENREADER_INSTRUCTIONS = 'When autocomplete results are available, use up and down arrows to review and enter to select.'
const builtInCssClasses: VisualSearchBarCssClasses = { 
  ...builtInSearchBarCssClasses, 
  recentSearchesOptionContainer: 'flex items-center py-1 px-2 cursor-pointer',
  recentSearchesIcon: 'w-4',
  recentSearchesOption: 'ml-2',
  verticalLink: 'ml-14 text-gray-600'
};

interface VisualSearchBarCssClasses extends SearchBarCssClasses {
  recentSearchesOptionContainer?: string,
  recentSearchesIcon?: string,
  recentSearchesOption?: string,
  verticalLink: string
}

type RenderEntityPreviews = (
  autocompleteLoading: boolean,
  verticalResultsArray: VerticalResults[]
) => JSX.Element;

interface VerticalLink {
  label: string,
  verticalKey: string
}

interface Props {
  placeholder?: string,
  geolocationOptions?: PositionOptions,
  screenReaderInstructionsId: string,
  headlessId: string,
  // The debouncing time, in milliseconds, for making API requests for entity previews
  entityPreviewsDebouncingTime: number,
  renderEntityPreviews?: RenderEntityPreviews,
  hideVerticalLinks?: boolean,
  verticalKeyToLabel?: (verticalKey: string) => string,
  hideRecentSearches?: boolean,
  recentSearchesLimit?: number,
  customCssClasses?: VisualSearchBarCssClasses,
  cssCompositionMethod?: CompositionMethod
}

/**
 * Renders a SearchBar with visual autocomplete.
 */
export default function VisualSearchBar({
  placeholder,
  screenReaderInstructionsId,
  headlessId,
  hideRecentSearches,
  renderEntityPreviews,
  hideVerticalLinks,
  verticalKeyToLabel,
  recentSearchesLimit = 5,
  customCssClasses,
  cssCompositionMethod,
  entityPreviewsDebouncingTime = 500
}: PropsWithChildren<Props>) {
  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses, cssCompositionMethod);

  const browserHistory = useHistory();
  const answersActions = useAnswersActions();
  const query = useAnswersState(state => state.query.input) ?? '';
  const isLoading = useAnswersState(state => state.searchStatus.isLoading) ?? false;
  const [executeQueryWithNearMeHandling, autocompletePromiseRef] = useSearchWithNearMeHandling(answersActions)
  const [autocompleteResponse, executeAutocomplete] = useSynchronizedRequest(async () => {
    return answersActions.executeUniversalAutocomplete();
  });
  const [recentSearches, setRecentSearch, clearRecentSearches] = useRecentSearches(recentSearchesLimit);
  useEffect(() => {
    if (hideRecentSearches) {
      clearRecentSearches();
    }
  }, [clearRecentSearches, hideRecentSearches])
  const haveRecentSearches = !hideRecentSearches && recentSearches?.length !== 0;
  

  function executeQuery() {
    if (!hideRecentSearches) {
      const input = answersActions.state.query.input;
      input && setRecentSearch(input);
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
    const restrictVerticals = calculateRestrictVerticals(entityPreviews);
    const universalLimit = calculateUniversalLimit(entityPreviews);
    executeEntityPreviewsQuery(query, universalLimit, restrictVerticals);
  }

  function renderQuerySuggestions() {
    if (autocompleteResults.length === 0) {
      return null;
    }
    let options: Option[] = [];
    autocompleteResults.forEach(result => {
      options.push({
        value: result.value,
        onSelect: () => {
          autocompletePromiseRef.current = undefined;
          answersActions.setQuery(result.value);
          executeQuery();
        },
        display: renderAutocompleteResult(result, cssClasses, MagnifyingGlassIcon)
      });

      if (hideVerticalLinks) {
        return;
      }
      /**
       * TODO (yen-tt): mocked data is used for testing purposes.
       * Should be replace with result.verticalKeys when backend work is done.
       */
      const verticalKeys = ['faqs', 'events'];
      let verticalLinks: VerticalLink[]|undefined = verticalKeys?.map(verticalKey => {
        return { 
          label: verticalKeyToLabel ? verticalKeyToLabel(verticalKey) : verticalKey,
          verticalKey
        }
      });

      verticalLinks?.forEach(link => 
        options.push({
          value: result.value,
          onSelect: () => {
            autocompletePromiseRef.current = undefined;
            answersActions.setQuery(result.value);
            executeQuery();
            browserHistory.push(`/${link.verticalKey}`);
          },
          display: renderAutocompleteResult({ value: `in ${link.label}` }, { ...cssClasses, option: cssClasses.verticalLink })
        })
      );
    });

    return <DropdownSection
      options={options}
      optionIdPrefix='VisualSearchBar-QuerySuggestions'
      onFocusChange={value => {
        answersActions.setQuery(value);
        updateEntityPreviews(value);
      }}
      cssClasses={cssClasses}
    />
  }

  function renderRecentSearches() {
    const recentSearchesCssClasses = {
      ...cssClasses,
      optionContainer: cssClasses.recentSearchesOptionContainer,
      icon: cssClasses.recentSearchesIcon,
      option: cssClasses.recentSearchesOption
    }
    const options: Option[] = recentSearches?.map(result => {
      return {
        value: result.query,
        onSelect: () => {
          autocompletePromiseRef.current = undefined;
          answersActions.setQuery(result.query);
          executeQuery();
        },
        display: renderAutocompleteResult({ value: result.query }, recentSearchesCssClasses, RecentSearchIcon)
      }
    }) ?? [];
    if (options.length === 0) {
      return null;
    }

    return <DropdownSection
      options={options}
      optionIdPrefix='VisualSearchBar-RecentSearches'
      onFocusChange={value => {
        answersActions.setQuery(value);
      }}
      cssClasses={recentSearchesCssClasses}
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
          forceHideDropdown={autocompleteResults.length === 0 && verticalResultsArray.length === 0 && !haveRecentSearches}
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