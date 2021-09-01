import { useReducer, KeyboardEvent, useRef, useEffect, useState } from "react"
import Input from './Input';
import Dropdown, { Option } from './Dropdown';

interface Props {
  inputValue?: string
  placeholder?: string
  options: Option[]
  onInputValueChange: (inputValue: string) => void
  onInputClick?: () => void
  onSubmit?: (value: string) => void
  onFocusedOptionChange?: (optionIndex: string) => void
  renderButtons?: () => JSX.Element | null
  cssClasses: {
    optionContainer: string,
    option: string
    focusedOption: string
    inputElement: string,
    inputContainer: string
  }
}

interface State {
  focusedOptionIndex?: number
  shouldDisplayDropdown: boolean
}

type Action = 
  | { type: 'HideOptions' }
  | { type: 'ShowOptions' }
  | { type: 'FocusOption', newIndex?: number }

function reducer(state: State, action: Action): State {
  switch(action.type) {
    case 'HideOptions': 
      return { focusedOptionIndex: undefined, shouldDisplayDropdown: false }
    case 'ShowOptions': 
      return { focusedOptionIndex: undefined, shouldDisplayDropdown: true }
    case 'FocusOption': 
      return { focusedOptionIndex: action.newIndex, shouldDisplayDropdown: true }
  }
}

/**
 * Manages the interactions for the combination of the Input and Dropdown components
 */
export default function InputDropdown({
  inputValue = '',
  placeholder,
  options,
  onInputValueChange,
  onInputClick = () => {},
  onSubmit = () => {},
  onFocusedOptionChange = () => {},
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

  const [latestUserInput, setLatestUserInput] = useState(inputValue);

  const inputRef = useRef<HTMLInputElement>(document.createElement('input')); 
  
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

    console.log(evt.key + ' focusedOptionIndex: ' + focusedOptionIndex);

    if (evt.key === 'Enter') {
      onSubmit(inputValue);
      dispatch({ type: 'HideOptions' });
    } else if (evt.key === 'Escape') {
      dispatch({ type: 'HideOptions' });
    } else if (evt.key === 'ArrowDown' && !isLastOptionFocused) {
      const newIndex = focusedOptionIndex !== undefined ? focusedOptionIndex + 1 : 0;
      dispatch({ type: 'FocusOption', newIndex });
      const newValue = options[newIndex]?.value;
      onFocusedOptionChange(newValue);
    } else if (evt.key === 'ArrowUp' && focusedOptionIndex !== undefined) {
      const newIndex = isFirstOptionFocused ? undefined : focusedOptionIndex - 1;
      dispatch({ type: 'FocusOption', newIndex });
      const newValue = newIndex !== undefined
        ? options[newIndex]?.value
        : latestUserInput;
      onFocusedOptionChange(newValue);
    }
  }

  return (
    <>
      <Input
        inputValue={inputValue}
        placeholder={placeholder}
        onChange={value => {
          dispatch({ type: 'ShowOptions' });
          setLatestUserInput(value);
          onInputValueChange(value);
        }}
        onClick={() => {
          dispatch({ type: 'ShowOptions' });
          onInputClick()
        }}
        onKeyDown={onKeyDown}
        renderButtons={renderButtons}
        cssClasses={cssClasses}
        ref={inputRef}
      />
      {shouldDisplayDropdown &&
        <Dropdown
          options={options}
          onClickOption={option => {
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