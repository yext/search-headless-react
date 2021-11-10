import { FilterSearchResponse } from "@yext/answers-core";
import { SearchParameterField } from "@yext/answers-core";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAnswersActions } from '@yext/answers-headless-react';
import InputDropdown from "./InputDropdown";
import renderWithHighlighting from "./utils/renderWithHighlighting";
import { Option } from "./Dropdown";

const SCREENREADER_INSTRUCTIONS = 'When autocomplete results are available, use up and down arrows to review and enter to select.'

export interface FilterSearchProps {
  title: string,
  sectioned: boolean,
  searchFields: SearchParameterField[],
  screenReaderInstructionsId: string
}


export default function FilterSearch (props: FilterSearchProps): JSX.Element {
  const { title, sectioned, searchFields, screenReaderInstructionsId } = props;
  const answersActions = useAnswersActions();
  const input = useRef<string>('');
  const [results, updateResults] = useState<FilterSearchResponse|undefined>();
  const [, setMessage] = useState( '' );
  const requestId = useRef(0);
  const responseId = useRef(0);



  const executeSearch = useCallback(async () => {
    const currentId = ++requestId.current;
    const results = await answersActions.executeFilterSearch(input.current, sectioned, searchFields);
    if (currentId >= responseId.current) {
      responseId.current++;
      updateResults(results);
    }
  }, [answersActions, searchFields, sectioned]);

  useEffect(() => {
    executeSearch();
  }, [executeSearch]);

  let stuff: Option[]  = [];
  if (results) {
    if(results.sectioned) {
      results.sections.forEach(section => {
        section.results.forEach(result => {
          stuff.push({
            value: result.value,
            render: () => renderWithHighlighting(result)
          });
        })
      });
    } else {
      stuff = results.results.map(result => {
        return {
          value: result.value,
          render: () => renderWithHighlighting(result)
        }
      });
    }
  }

  return (
    <div className='FilterSearch'>
      <h1>{title}</h1>
      <InputDropdown
        inputValue={input.current}
        placeholder='this is filter search...'
        screenReaderInstructions={SCREENREADER_INSTRUCTIONS}
        screenReaderInstructionsId={screenReaderInstructionsId}
        options={stuff}
        optionIdPrefix='Autocomplete__option'
        onSubmit={() => {
          answersActions.executeVerticalQuery();
          setMessage('enter!');
        }}
        updateInputValue={newInput => {
          input.current = newInput;
        }}
        updateDropdown={() => {
          executeSearch();
        }}
        cssClasses={{
          optionContainer: 'Autocomplete',
          option: 'Autocomplete__option',
          focusedOption: 'Autocomplete__option--focused',
          inputElement: 'FilterSearch__input',
          inputContainer: 'FilterSearch__inputContainer'
        }}
      />
    </div>
  );
}