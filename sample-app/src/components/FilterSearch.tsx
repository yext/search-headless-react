import { FilterSearchResponse } from "@yext/answers-headless";
import { SearchParameterField } from "@yext/answers-headless";
import { useRef, useState } from "react";
import { useAnswersActions } from '@yext/answers-headless-react';
import InputDropdown from "./InputDropdown";
import renderWithHighlighting from "./utils/renderWithHighlighting";
import { Option } from "./Dropdown";

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
  const [results, updateResults] = useState<FilterSearchResponse|undefined>();
  const requestId = useRef(0);
  const responseId = useRef(0);
  const searchParamFields = searchFields.map((searchField) => {
    return { ...searchField, fetchEntities: false }
  });

  async function executeFilterSearch (inputValue: string) {
    const currentId = ++requestId.current;
    const results = await answersActions.executeFilterSearch(inputValue, sectioned, searchParamFields);
    if (currentId >= responseId.current) {
      responseId.current++;
      updateResults(results);
    }
  }

  let options: { results: Option[], label?: string }[] = [];
  if (results) {
    options = results.sections.map(section => {
      return {
        results: section.results.map(result => {
          return {
            value: result.value,
            render: () => renderWithHighlighting(result)
          };
        }),
        label: section.label
      };
    });
  }

  return (
    <div className='FilterSearch'>
      <h1>{title}</h1>
      <InputDropdown
        inputValue={input}
        placeholder='this is filter search...'
        screenReaderInstructions={SCREENREADER_INSTRUCTIONS}
        screenReaderInstructionsId={screenReaderInstructionsId}
        options={options}
        optionIdPrefix='Autocomplete__option'
        onlySubmitOnOption={true}
        onSubmit={(optionValue, sectionIndex, optionIndex) => {
          if (sectionIndex !== undefined && optionIndex !== undefined && results) {
            const option = results.sections[sectionIndex].results[optionIndex];
            if (option.filter) {
              answersActions.setFilterOption({ ...option.filter, selected: true });
              answersActions.executeVerticalQuery();
            }
          }
        }}
        updateInputValue={newInput => {
          setInput(newInput);
        }}
        updateDropdown={(input) => {
          executeFilterSearch(input);
        }}
        cssClasses={{
          optionContainer: 'Autocomplete',
          optionSection: 'Autocomplete__optionSection',
          sectionLabel: 'Autocomplete__sectionLabel',
          option: 'Autocomplete__option',
          focusedOption: 'Autocomplete__option--focused',
          inputElement: 'FilterSearch__input',
          inputContainer: 'FilterSearch__inputContainer'
        }}
      />
    </div>
  );
}