import { useReducer, KeyboardEvent, useRef, useEffect, useState } from "react"
import Dropdown, { Option } from './Dropdown';
import ScreenReader from "./ScreenReader";
import { processTranslation } from './utils/processTranslation';

interface Props {
  inputValue?: string,
  placeholder?: string,
  screenReaderInstructions: string,
  screenReaderInstructionsId: string,
  options: Option[],
  optionIdPrefix: string,
  onSubmit?: (value: string) => void,
  updateInputValue: (value: string) => void,
  updateDropdown: () => Promise<void>,
  renderButtons?: () => JSX.Element | null,
  cssClasses: {
    optionContainer: string,
    option: string,
    focusedOption: string,
    inputElement: string,
    inputContainer: string
  }
}

interface State {
  focusedOptionIndex?: number,
  shouldDisplayDropdown: boolean
}

type Action =
  | { type: 'HideOptions' }
  | { type: 'ShowOptions' }
  | { type: 'FocusOption', newIndex?: number }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'HideOptions':
      return { focusedOptionIndex: undefined, shouldDisplayDropdown: false }
    case 'ShowOptions':
      return { focusedOptionIndex: undefined, shouldDisplayDropdown: true }
    case 'FocusOption':
      return { focusedOptionIndex: action.newIndex, shouldDisplayDropdown: true }
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
  onSubmit = () => {},
  updateInputValue,
  updateDropdown,
  renderButtons = () => null,
  cssClasses
}: Props): JSX.Element | null {
  const [{
    focusedOptionIndex,
    shouldDisplayDropdown,
  }, dispatch] = useReducer(reducer, {
    focusedOptionIndex: undefined,
    shouldDisplayDropdown: false,
  });
  const focusOptionId = focusedOptionIndex === undefined
    ? undefined
    : `${optionIdPrefix}-${focusedOptionIndex}`;

  const [latestUserInput, setLatestUserInput] = useState(inputValue);
  const [screenReaderKey, setScreenReaderKey] = useState(0);

  const inputRef = useRef<HTMLInputElement>(document.createElement('input'));

  if (!shouldDisplayDropdown && screenReaderKey) {
    setScreenReaderKey(0);
  }

  function handleDocumentClick(evt: MouseEvent) {
    const target = evt.target as HTMLElement;
    if (!target.isSameNode(inputRef.current)) {
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

    const isFirstOptionFocused = focusedOptionIndex === 0;
    const isLastOptionFocused = focusedOptionIndex === options.length - 1;
    if (evt.key === 'Enter') {
      updateInputValue(inputValue);
      onSubmit(inputValue);
      dispatch({ type: 'HideOptions' });
    } else if (evt.key === 'Escape' || evt.key === 'Tab') {
      dispatch({ type: 'HideOptions' });
    } else if (evt.key === 'ArrowDown' && options.length > 0 && !isLastOptionFocused) {
      const newIndex = focusedOptionIndex !== undefined ? focusedOptionIndex + 1 : 0;
      dispatch({ type: 'FocusOption', newIndex });
      const newValue = options[newIndex]?.value;
      updateInputValue(newValue);
    } else if (evt.key === 'ArrowUp' && focusedOptionIndex !== undefined) {
      const newIndex = isFirstOptionFocused ? undefined : focusedOptionIndex - 1;
      dispatch({ type: 'FocusOption', newIndex });
      const newValue = newIndex !== undefined
        ? options[newIndex]?.value
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
          onChange={async evt => {
            const value = evt.target.value;
            dispatch({ type: 'ShowOptions' });
            setLatestUserInput(value);
            updateInputValue(value);
            await updateDropdown();
            setScreenReaderKey(screenReaderKey + 1);
          }}
          onClick={async () => {
            await updateDropdown();
            dispatch({ type: 'ShowOptions' });
            if (options.length || inputValue) {
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
        announcementText={screenReaderKey ?
          processTranslation({
            phrase: `${options.length} autocomplete option found.`,
            pluralForm: `${options.length} autocomplete options found.`,
            count: options.length
          })
          : ''
        }
      />
      {shouldDisplayDropdown &&
        <Dropdown
          options={options}
          optionIdPrefix={optionIdPrefix}
          onClickOption={option => {
            updateInputValue(option.value);
            onSubmit(option.value)
            dispatch({ type: 'HideOptions' })
          }}
          focusedOptionIndex={focusedOptionIndex}
          cssClasses={cssClasses}
        />
      }
    </>
  );
};