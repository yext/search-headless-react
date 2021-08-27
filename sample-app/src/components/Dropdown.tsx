import { useReducer, KeyboardEvent, useRef, useEffect, useState } from "react"
import classNames from 'classnames';

interface Option {
  value: string
  render: () => JSX.Element | null;
}

interface Props {
  inputValue?: string
  placeholder?: string
  options: Option[]
  onInputValueChange: (inputValue: string) => void
  onInputClick?: () => void
  onSubmit?: (value: string) => void
  onFocusedOptionChange?: (optionIndex: string) => void
  renderWithinInputContainer?: () => JSX.Element | null
  cssClasses: {
    optionContainer: string,
    option: string
    selectedOption: string
    inputElement: string,
    inputContainer: string
  }
}

interface State {
  focusedOptionIndex: number
  shouldDisplayOptions: boolean
}

type Action = 
  | { type: 'HideOptions' }
  | { type: 'ShowOptions' }
  | { type: 'FocusOption', newIndex: number }

function reducer(state: State, action: Action): State {
  switch(action.type) {
    case 'HideOptions': 
      return { focusedOptionIndex: -1, shouldDisplayOptions: false }
    case 'ShowOptions': 
      return { focusedOptionIndex: -1, shouldDisplayOptions: true }
    case 'FocusOption': 
      return { focusedOptionIndex: action.newIndex, shouldDisplayOptions: true }
  }
}

export default function Dropdown ({
  inputValue = '',
  placeholder,
  options,
  onInputValueChange,
  onInputClick = () => {},
  onSubmit = () => {},
  onFocusedOptionChange = () => {},
  renderWithinInputContainer = () => null,
  cssClasses
}: Props): JSX.Element | null {
  const [{
    focusedOptionIndex,
    shouldDisplayOptions,
  }, dispatch] = useReducer(reducer, {
    focusedOptionIndex: -1,
    shouldDisplayOptions: false,
  });

  const [latestInputValue, setLatestInputValue] = useState(inputValue);

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

    if (evt.key === 'Enter') {
      onSubmit(inputValue);
      dispatch({ type: 'HideOptions' });
    } else if (evt.key === 'Escape') {
      dispatch({ type: 'HideOptions' });
    } else if (evt.key === 'ArrowDown' && focusedOptionIndex < options.length - 1) {
      const newIndex = focusedOptionIndex + 1;
      dispatch({ type: 'FocusOption', newIndex });
      const newValue = options[newIndex]?.value;
      onFocusedOptionChange(newValue);
    } else if (evt.key === 'ArrowUp' && focusedOptionIndex >= 0) {
      const newIndex = focusedOptionIndex - 1;
      dispatch({ type: 'FocusOption', newIndex });
      const newValue = newIndex < 0
        ? latestInputValue
        : options[newIndex]?.value;
      onFocusedOptionChange(newValue);
    }
  }

  return (
    <>
      <div className={cssClasses.inputContainer}>
        <input
          className={cssClasses.inputElement}
          placeholder={placeholder}
          onChange={evt => {
            dispatch({ type: 'ShowOptions' })
            const inputValue = evt.target.value;
            setLatestInputValue(inputValue);
            onInputValueChange(inputValue);
          }}
          onClick={() => onInputClick()}
          onKeyDown={onKeyDown}
          value={inputValue}
          ref={inputRef}
        />
        {renderWithinInputContainer()}
      </div>
      {shouldDisplayOptions && options.length > 0 && 
        <div className={cssClasses.optionContainer}>
        {options.map((option, index) => {
          const className = classNames(cssClasses.option, {
            [cssClasses.selectedOption]: index === focusedOptionIndex
          })
          return <div key={option.value} className={className} onClick={() => { 
            onSubmit(option.value)
            dispatch({ type: 'HideOptions' })
          }}>{option.render()}</div>
        })}
      </div>
      }
    </>
  );
};