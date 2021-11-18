import { useReducer, KeyboardEvent, useRef, useEffect, useState } from "react"
import Dropdown, { Option } from './Dropdown';
import ScreenReader from "./ScreenReader";
import { processTranslation } from './utils/processTranslation';

interface Props {
  inputValue?: string,
  placeholder?: string,
  screenReaderInstructions: string,
  screenReaderInstructionsId: string,
  options: { results: Option[], label?: string }[],
  optionIdPrefix: string,
  onlySubmitOnOption: boolean,
  onSubmit?: (value: string, sectionIndex?: number, optionIndex?: number) => void,
  updateInputValue: (value: string) => void,
  updateDropdown: (input: string) => void,
  renderButtons?: () => JSX.Element | null,
  cssClasses: {
    optionContainer: string,
    optionSection: string,
    sectionLabel: string,
    option: string,
    focusedOption: string,
    inputElement: string,
    inputContainer: string
  }
}

interface State {
  focusedSectionIndex?: number,
  focusedOptionIndex?: number,
  shouldDisplayDropdown: boolean
}

type Action =
  | { type: 'HideOptions' }
  | { type: 'ShowOptions' }
  | { type: 'FocusOption', newSectionIndex?: number, newOptionIndex?: number }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'HideOptions':
      return { focusedSectionIndex: undefined, focusedOptionIndex: undefined, shouldDisplayDropdown: false }
    case 'ShowOptions':
      return { focusedSectionIndex: undefined, focusedOptionIndex: undefined, shouldDisplayDropdown: true }
    case 'FocusOption':
      return { focusedSectionIndex: action.newSectionIndex, focusedOptionIndex: action.newOptionIndex, shouldDisplayDropdown: true }
  }
}

/**
 * A controlled input component with an attached dropdown.
 */
export default function InputDropdown({
  inputValue = '',
  placeholder,
  screenReaderInstructions,
  screenReaderInstructionsId,
  options,
  optionIdPrefix,
  onlySubmitOnOption,
  onSubmit = () => {},
  updateInputValue,
  updateDropdown,
  renderButtons = () => null,
  cssClasses
}: Props): JSX.Element | null {
  const [{
    focusedSectionIndex,
    focusedOptionIndex,
    shouldDisplayDropdown,
  }, dispatch] = useReducer(reducer, {
    focusedSectionIndex: undefined,
    focusedOptionIndex: undefined,
    shouldDisplayDropdown: false,
  });
  const focusOptionId = focusedOptionIndex === undefined
    ? undefined
    : `${optionIdPrefix}-${focusedSectionIndex}-${focusedOptionIndex}`;

  const [latestUserInput, setLatestUserInput] = useState(inputValue);
  const [screenReaderKey, setScreenReaderKey] = useState(0);

  const inputRef = useRef<HTMLInputElement>(document.createElement('input'));

  if (!shouldDisplayDropdown && screenReaderKey) {
    setScreenReaderKey(0);
  }

  const screenReaderPhrases: string[] = [];
  if (options.length < 1) {
    const phrase = processTranslation({
      phrase: `0 autocomplete option found.`,
      pluralForm: `0 autocomplete options found.`,
      count: 0
    });
    screenReaderPhrases.push(phrase);
  } else {
    options.forEach(section => {
      const optionInfo = section.label? `${section.results.length} ${section.label}` : `${section.results.length}`;
      const phrase = processTranslation({
        phrase: `${optionInfo} autocomplete option found.`,
        pluralForm: `${optionInfo} autocomplete options found.`,
        count: section.results.length
      });
      screenReaderPhrases.push(phrase);
    });
  }
  const screenReaderText = screenReaderPhrases.join(' ');

  function handleDocumentClick(evt: MouseEvent) {
    const target = evt.target as HTMLElement;
    if (!(target.isSameNode(inputRef.current) || target.classList.contains(cssClasses.optionContainer)
      || target.classList.contains(cssClasses.optionSection) || target.classList.contains(cssClasses.sectionLabel))) {
      dispatch({ type: 'HideOptions' });
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick)
    return () => document.removeEventListener('click', handleDocumentClick);
  });

  function onKeyDown(evt: KeyboardEvent<HTMLInputElement>) {
    if (['ArrowDown', 'ArrowUp'].includes(evt.key)) {
      evt.preventDefault();
    }

    const isFirstSectionFocused = focusedSectionIndex === 0;
    const isLastSectionFocused = focusedSectionIndex === options.length - 1;
    const isFirstOptionFocused = focusedOptionIndex === 0;
    const isLastOptionFocused = 
      focusedSectionIndex !== undefined &&
      focusedOptionIndex === options[focusedSectionIndex].results.length - 1;
    if (evt.key === 'Enter' && (!onlySubmitOnOption || focusedOptionIndex !== undefined)) {
      onSubmit(inputValue, focusedSectionIndex, focusedOptionIndex);
      dispatch({ type: 'HideOptions' });
    } else if (evt.key === 'Escape' || evt.key === 'Tab') {
      dispatch({ type: 'HideOptions' });
    } else if (evt.key === 'ArrowDown' && options.length > 0 && !(isLastSectionFocused && isLastOptionFocused)) {
      let newSectionIndex, newOptionIndex;
      if (isLastOptionFocused) {
        newSectionIndex = focusedSectionIndex !== undefined ? focusedSectionIndex + 1 : 0;
        newOptionIndex = 0;
      } else {
        newSectionIndex = focusedSectionIndex !== undefined ? focusedSectionIndex : 0;
        newOptionIndex = focusedOptionIndex !== undefined ? focusedOptionIndex + 1 : 0;
      }
      dispatch({ type: 'FocusOption', newSectionIndex, newOptionIndex });
      const newValue = options[newSectionIndex].results[newOptionIndex].value;
      updateInputValue(newValue);
    } else if (evt.key === 'ArrowUp' && focusedSectionIndex !== undefined && focusedOptionIndex !== undefined) {
      let newSectionIndex, newOptionIndex;
      if (isFirstOptionFocused) {
        newSectionIndex = isFirstSectionFocused ? undefined : focusedSectionIndex - 1;
        newOptionIndex = newSectionIndex !== undefined ? options[newSectionIndex].results.length - 1 : undefined;
      } else {
        newSectionIndex = focusedSectionIndex;
        newOptionIndex = focusedOptionIndex - 1;
      }
      dispatch({ type: 'FocusOption', newSectionIndex, newOptionIndex });
      const newValue = newSectionIndex !== undefined && newOptionIndex !== undefined
        ? options[newSectionIndex].results[newOptionIndex].value
        : latestUserInput;
      updateInputValue(newValue);
    }
  }

  return (
    <>
      <div className={cssClasses.inputContainer}>
        <input
          className={cssClasses.inputElement}
          placeholder={placeholder}
          onChange={evt => {
            const value = evt.target.value;
            dispatch({ type: 'ShowOptions' });
            setLatestUserInput(value);
            updateInputValue(value);
            updateDropdown(value);
            setScreenReaderKey(screenReaderKey + 1);
          }}
          onClick={() => {
            updateDropdown(inputValue);
            dispatch({ type: 'ShowOptions' });
            if (options[0]?.results.length || inputValue) {
              setScreenReaderKey(screenReaderKey + 1);
            }
          }}
          onKeyDown={onKeyDown}
          value={inputValue}
          ref={inputRef}
          aria-describedby={screenReaderInstructionsId}
          aria-activedescendant={focusOptionId}
        />
        {renderButtons()}
      </div>
      <ScreenReader
        instructionsId={screenReaderInstructionsId}
        instructions={screenReaderInstructions}
        announcementKey={screenReaderKey}
        announcementText={screenReaderKey ? screenReaderText : ''}
      />
      {shouldDisplayDropdown &&
        <Dropdown
          options={options}
          optionIdPrefix={optionIdPrefix}
          onClickOption={(option, sectionIndex, optionIndex) => {
            updateInputValue(option.value);
            onSubmit(option.value, sectionIndex, optionIndex)
            dispatch({ type: 'HideOptions' })
          }}
          focusedSectionIndex={focusedSectionIndex}
          focusedOptionIndex={focusedOptionIndex}
          cssClasses={cssClasses}
        />
      }
    </>
  );
};