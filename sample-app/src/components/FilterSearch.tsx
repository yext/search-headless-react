import { SearchParameterField } from "@yext/answers-headless";
import { useState } from "react";
import { useAnswersActions } from '@yext/answers-headless-react';
import InputDropdown from "./InputDropdown";
import renderWithHighlighting from "./utils/renderWithHighlighting";
import { Option } from "./DropdownSection";
import DropdownSection from "./DropdownSection";
import { processTranslation } from "./utils/processTranslation";
import { useSynchronizedSearch } from "../hooks/useSynchronizedSearch";

const SCREENREADER_INSTRUCTIONS = 'When autocomplete results are available, use up and down arrows to review and enter to select.'

export interface FilterSearchProps {
  title: string,
  sectioned: boolean,
  searchFields: Omit<SearchParameterField, 'fetchEntities'>[],
  screenReaderInstructionsId: string
}

export default function FilterSearch (props: FilterSearchProps): JSX.Element {
  const { title, sectioned, searchFields, screenReaderInstructionsId } = props;
  const answersActions = useAnswersActions();
  const [input, setInput] = useState('');
  const searchParamFields = searchFields.map((searchField) => {
    return { ...searchField, fetchEntities: false }
  });

  const [filterSearchResponse, executeFilterSearch] = useSynchronizedSearch((inputValue) => {
    return inputValue
      ? answersActions.executeFilterSearch(inputValue, sectioned, searchParamFields)
      : answersActions.executeFilterSearch('', sectioned, searchParamFields);
  });

  let sections: { results: Option[], label?: string }[] = [];
  if (filterSearchResponse?.results) {
    sections = filterSearchResponse.sections.map(section => {
      return {
        results: section.results.map(result => {
          return {
            value: result.value,
            display: renderWithHighlighting(result)
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
        onlySubmitOnOption={true}
        onInputChange={newInput => {
          setInput(newInput);
        }}
        onInputFocus={(input) => {
          executeFilterSearch(input);
        }}
        cssClasses={{
          dropdownContainer: 'Autocomplete',
          inputElement: 'FilterSearch__input',
          inputContainer: 'FilterSearch__inputContainer'
        }}
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
              onSubmit={(optionIndex, option) => {
                if (option) {
                  setInput(option.value);
                }
                const result = filterSearchResponse?.sections[sectionIndex].results[optionIndex];
                if (result?.filter) {
                  answersActions.setFilterOption({ ...result.filter, selected: true });
                  answersActions.executeVerticalQuery();
                }
              }}
              label={section.label}
              cssClasses={{
                sectionContainer: 'Autocomplete__dropdownSection',
                sectionLabel: 'Autocomplete__sectionLabel',
                optionsContainer: 'Autocomplete_sectionOptions',
                option: 'Autocomplete__option',
                focusedOption: 'Autocomplete__option--focused'
              }}
            />
          );
        })}
      </InputDropdown>
    </div>
  );
}