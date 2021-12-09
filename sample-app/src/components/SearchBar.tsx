import { useAnswersActions, useAnswersState } from '@yext/answers-headless-react';
import InputDropdown, { InputDropdownCssClasses } from './InputDropdown';
import { ReactComponent as YextLogoIcon } from '../icons/yext_logo.svg';
import '../sass/Autocomplete.scss';
import DropdownSection, { DropdownSectionCssClasses, Option } from './DropdownSection';
import { processTranslation } from './utils/processTranslation';
import SearchButton from './SearchButton';
import { useSynchronizedRequest } from '../hooks/useSynchronizedRequest';
import useSearchWithNearMeHandling from '../hooks/useSearchWithNearMeHandling';
import { CompositionMethod, useComposedCssClasses } from '../hooks/useComposedCssClasses';
import renderAutocompleteResult, {
  AutocompleteResultCssClasses,
  builtInCssClasses as AutocompleteResultBuiltInCssClasses
} from './utils/renderAutocompleteResult';
import { ReactComponent as MagnifyingGlassIcon } from '../icons/magnifying_glass.svg';

const SCREENREADER_INSTRUCTIONS = 'When autocomplete results are available, use up and down arrows to review and enter to select.'

export const builtInCssClasses: SearchBarCssClasses = {
  container: 'h-12',
  divider: 'border mx-2',
  dropdownContainer: 'relative bg-white py-1 z-10',
  inputContainer: 'h-12 inline-flex items-center justify-between w-full',
  inputDropdownContainer: 'bg-white shadow border rounded-3xl border-gray-300 w-full overflow-hidden',
  inputElement: 'outline-none flex-grow border-none h-full px-2',
  logoContainer: 'w-8 mx-2',
  optionContainer: 'flex items-stretch py-1 px-2 cursor-pointer',
  resultIconContainer: 'opacity-20 w-8 h-8 pl-1 mr-4',
  searchButtonContainer: 'w-8 h-full mx-2',
  submitButton: 'h-full w-full',
  focusedOption: 'bg-gray-100',
  ...AutocompleteResultBuiltInCssClasses
}


export interface SearchBarCssClasses 
  extends InputDropdownCssClasses, DropdownSectionCssClasses, AutocompleteResultCssClasses 
{
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
 * Renders a SearchBar that is hooked up with an InputDropdown component
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
  const [autocompleteResponse, executeAutocomplete] = useSynchronizedRequest(() => {
    return isVertical
      ? answersActions.executeVerticalAutocomplete()
      : answersActions.executeUniversalAutocomplete();
  });
  const [executeQuery, autocompletePromiseRef] = useSearchWithNearMeHandling(answersActions, geolocationOptions);
  const options: Option[] = autocompleteResponse?.results.map(result => {
    return {
      value: result.value,
      onClick: () => {
        autocompletePromiseRef.current = undefined;
        answersActions.setQuery(result.value);
        executeQuery();
      },
      display: renderAutocompleteResult(result, cssClasses, MagnifyingGlassIcon)
    }
  }) ?? [];

  const screenReaderText = processTranslation({
    phrase: `${options.length} autocomplete option found.`,
    pluralForm: `${options.length} autocomplete options found.`,
    count: options.length
  });

  function renderSearchButton() {
    return <SearchButton
      className={cssClasses.submitButton}
      handleClick={executeQuery}
      isLoading={isLoading || false}
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
          screenReaderText={screenReaderText}
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
          forceHideDropdown={options.length === 0}
        >
          {
            options.length > 0 &&
            <DropdownSection
              options={options}
              optionIdPrefix='Autocomplete__option-0'
              onFocusChange={value => {
                answersActions.setQuery(value);
              }}
              cssClasses={cssClasses}
            />
          }
        </InputDropdown>
      </div>
    </div>
  )
}
