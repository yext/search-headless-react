import { useRef, useState } from "react";
import { useAnswersActions, FilterSearchResponse, SearchParameterField, Filter } from '@yext/answers-headless-react';
import InputDropdown, { InputDropdownCssClasses } from "./InputDropdown";
import DropdownSection, { DropdownSectionCssClasses, Option } from "./DropdownSection";
import { processTranslation } from "./utils/processTranslation";
import { useSynchronizedRequest } from "../hooks/useSynchronizedRequest";
import renderAutocompleteResult, { AutocompleteResultCssClasses } from "./utils/renderAutocompleteResult";

const SCREENREADER_INSTRUCTIONS = 'When autocomplete results are available, use up and down arrows to review and enter to select.'

interface FilterSearchCssClasses extends InputDropdownCssClasses, DropdownSectionCssClasses, AutocompleteResultCssClasses {}

const builtInCssClasses: FilterSearchCssClasses = {
  dropdownContainer: 'Autocomplete',
  inputElement: 'FilterSearch__input',
  inputContainer: 'FilterSearch__inputContainer',
  sectionContainer: 'Autocomplete__dropdownSection',
  sectionLabel: 'Autocomplete__sectionLabel',
  optionsContainer: 'Autocomplete_sectionOptions',
  optionContainer: 'Autocomplete__option',
  focusedOption: 'bg-gray-100'
}

export interface FilterSearchProps {
  title: string,
  sectioned: boolean,
  searchFields: Omit<SearchParameterField, 'fetchEntities'>[],
  screenReaderInstructionsId: string,
  customCssClasses?: FilterSearchCssClasses
}

export default function FilterSearch ({
  title,
  sectioned,
  searchFields,
  screenReaderInstructionsId,
  customCssClasses
}: FilterSearchProps): JSX.Element {
  const answersActions = useAnswersActions();
  const [input, setInput] = useState('');
  const selectedFilterOptionRef = useRef<Filter|null>(null);
  const searchParamFields = searchFields.map((searchField) => {
    return { ...searchField, fetchEntities: false }
  });
  const cssClasses = { ...builtInCssClasses, ...customCssClasses };

  const [filterSearchResponse, executeFilterSearch] = useSynchronizedRequest<string, FilterSearchResponse>(inputValue =>
    answersActions.executeFilterSearch(inputValue ?? '', sectioned, searchParamFields)
  );

  let sections: { results: Option[], label?: string }[] = [];
  if (filterSearchResponse) {
    sections = filterSearchResponse.sections.map(section => {
      return {
        results: section.results.map(result => {
          return {
            value: result.value,
            onSelect: () => {
              setInput(result.value);
              if (result?.filter) {
                if (selectedFilterOptionRef.current) {
                  answersActions.setFilterOption({ ...selectedFilterOptionRef.current, selected: false });
                }
                selectedFilterOptionRef.current = result.filter;
                answersActions.setFilterOption({ ...result.filter, selected: true });
                answersActions.executeVerticalQuery();
              }
            },
            display: renderAutocompleteResult(result, cssClasses)
          };
        }),
        label: section.label
      };
    });
  }

  sections = sections.filter(section => section.results.length > 0);

  let screenReaderText = processTranslation({
    phrase: `0 autocomplete option found.`,
    pluralForm: `0 autocomplete options found.`,
    count: 0
  });
  if (sections.length > 0) {
    const screenReaderPhrases = sections.map(section => {
      const optionInfo = section.label 
        ? `${section.results.length} ${section.label}`
        : `${section.results.length}`;
      return processTranslation({
        phrase: `${optionInfo} autocomplete option found.`,
        pluralForm: `${optionInfo} autocomplete options found.`,
        count: section.results.length
      });
    });
    screenReaderText = screenReaderPhrases.join(' ');
  }

  return (
    <div className='FilterSearch'>
      <h1>{title}</h1>
      <InputDropdown
        inputValue={input}
        placeholder='this is filter search...'
        screenReaderInstructions={SCREENREADER_INSTRUCTIONS}
        screenReaderInstructionsId={screenReaderInstructionsId}
        screenReaderText={screenReaderText}
        onlyAllowDropdownOptionSubmissions={true}
        onInputChange={newInput => {
          setInput(newInput);
        }}
        onInputFocus={(input) => {
          executeFilterSearch(input);
        }}
        cssClasses={cssClasses}
      >
        {sections.map((section, sectionIndex) => {
          return (
            <DropdownSection
              key={`Autocomplete__section-${sectionIndex}`}
              options={section.results}
              optionIdPrefix={`Autocomplete__option-${sectionIndex}`}
              onFocusChange={value => {
                setInput(value);
              }}
              label={section.label}
              cssClasses={cssClasses}
            />
          );
        })}
      </InputDropdown>
    </div>
  );
}