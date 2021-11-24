import React, { useReducer, KeyboardEvent, useRef, useEffect, useState } from "react"
import ScreenReader from "./ScreenReader";

interface Props {
  inputValue?: string,
  placeholder?: string,
  screenReaderInstructions: string,
  screenReaderInstructionsId: string,
  screenReaderText: string,
  onSubmit?: (value: string) => void,
  onInputChange: (value: string) => void,
  onInputFocus: () => void,
  renderButtons?: () => JSX.Element | null,
  cssClasses: {
    dropdownContainer: string,
    inputElement: string,
    inputContainer: string
  }
}

interface State {
  focusedSectionIndex?: number,
  shouldDisplayDropdown: boolean
}

type Action =
  | { type: 'HideSections' }
  | { type: 'ShowSections' }
  | { type: 'FocusSection', newIndex?: number }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'HideSections':
      return { focusedSectionIndex: undefined, shouldDisplayDropdown: false }
    case 'ShowSections':
      return { focusedSectionIndex: undefined, shouldDisplayDropdown: true }
    case 'FocusSection':
      return { focusedSectionIndex: action.newIndex, shouldDisplayDropdown: true }
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
  screenReaderText,
  children,
  onSubmit = () => {},
  onInputChange,
  onInputFocus,
  renderButtons = () => null,
  cssClasses
}: React.PropsWithChildren<Props>): JSX.Element | null {
  const [{
    focusedSectionIndex,
    shouldDisplayDropdown,
  }, dispatch] = useReducer(reducer, {
    focusedSectionIndex: undefined,
    shouldDisplayDropdown: false,
  });

  const [focusedOptionId, setFocusedOptionId] = useState<string | undefined>(undefined);
  const [latestUserInput, setLatestUserInput] = useState(inputValue);
  const [screenReaderKey, setScreenReaderKey] = useState(0);

  const inputRef = useRef<HTMLInputElement>(document.createElement('input'));
  const dropdownRef = useRef<HTMLDivElement>(document.createElement('div'));

  if (!shouldDisplayDropdown && screenReaderKey) {
    setScreenReaderKey(0);
  }

  const childrenArray = React.Children.toArray(children);
  const childrenWithProps = childrenArray.map((child, index) => {
    if (!React.isValidElement(child)) {
      return child;
    }
    
    const modifiedOnClickOption : typeof child.props.onClickOption = (option: typeof child.props.options[0]) => {
      child.props.onClickOption(option);
      dispatch({ type: 'HideSections' });
    }

    const modifiedOnFocusChange = (value: string, focusedOptionId: string) => {
      child.props.onFocusChange(value);
      setFocusedOptionId(focusedOptionId);
    };

    if (focusedSectionIndex === undefined) {
      return React.cloneElement(child, { onLeaveSectionFocus, focusStatus: 'reset', onClickOption: modifiedOnClickOption });
    } else if (index === focusedSectionIndex) {
      return React.cloneElement(child, { onLeaveSectionFocus, focusStatus: 'active', onFocusChange: modifiedOnFocusChange, onClickOption: modifiedOnClickOption });
    } else {
      return React.cloneElement(child, { onLeaveSectionFocus, focusStatus: 'inactive', onClickOption: modifiedOnClickOption });
    }
  });

  const numSections = childrenWithProps.length;

  function onLeaveSectionFocus(focusNext: boolean) {
    if (focusedSectionIndex === undefined && focusNext) {
      dispatch({ type: 'FocusSection', newIndex: 0 });
    } else if (focusedSectionIndex !== undefined && focusedSectionIndex < numSections - 1) {
      let newSectionIndex: number | undefined = focusNext ? focusedSectionIndex + 1 : focusedSectionIndex - 1;
      if (newSectionIndex < 0) {
        newSectionIndex = undefined;
        onInputChange(latestUserInput);
      }
      dispatch({ type: 'FocusSection', newIndex: newSectionIndex });
    } else if (focusedSectionIndex === numSections - 1 && !focusNext) {
      dispatch({ type: 'FocusSection', newIndex: focusedSectionIndex - 1 });
    }
  }

  function handleDocumentClick(evt: MouseEvent) {
    const target = evt.target as HTMLElement;
    if (!(target.isSameNode(inputRef.current) || (dropdownRef.current !== null && dropdownRef.current.contains(target)))) {
      dispatch({ type: 'HideSections' });
    }
  }

  function handleDocumentKeydown(evt: globalThis.KeyboardEvent) {
    if ((evt.key === 'Escape' || evt.key === 'Tab')) {
      dispatch({ type: 'HideSections' });
    }
  }

  useEffect(() => {
    if (shouldDisplayDropdown) {
      document.addEventListener('click', handleDocumentClick);
      document.addEventListener('keydown', handleDocumentKeydown);
      return () => {
        document.removeEventListener('click', handleDocumentClick);
        document.removeEventListener('keydown', handleDocumentKeydown);
      }
    }
  });

  function onKeyDown(evt: KeyboardEvent<HTMLInputElement>) {
    if (['ArrowDown', 'ArrowRight'].includes(evt.key)) {
      evt.preventDefault();
    }

    if (evt.key === 'Enter') {
      onInputChange(inputValue);
      onSubmit(inputValue);
      dispatch({ type: 'HideSections' });
    } else if ((evt.key === 'ArrowDown' || evt.key === 'ArrowRight' ) && numSections > 0 && focusedSectionIndex === undefined) {
      dispatch({ type: 'FocusSection', newIndex: 0 });
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
            dispatch({ type: 'ShowSections' });
            setLatestUserInput(value);
            onInputChange(value);
            onInputFocus();
            setScreenReaderKey(screenReaderKey + 1);
          }}
          onClick={() => {
            onInputFocus();
            dispatch({ type: 'ShowSections' });
            if (numSections > 0 || inputValue) {
              setScreenReaderKey(screenReaderKey + 1);
            }
          }}
          onKeyDown={onKeyDown}
          value={inputValue}
          ref={inputRef}
          aria-describedby={screenReaderInstructionsId}
          aria-activedescendant={focusedOptionId}
        />
        {renderButtons()}
      </div>
      <ScreenReader
        instructionsId={screenReaderInstructionsId}
        instructions={screenReaderInstructions}
        announcementKey={screenReaderKey}
        announcementText={screenReaderKey ? screenReaderText : ''}
      />
      {shouldDisplayDropdown && numSections > 0 &&
        <div
          className={cssClasses.dropdownContainer}
          ref={dropdownRef}
        >
          {childrenWithProps}
        </div>
      }
    </>
  );
};