import React, { useReducer, KeyboardEvent, useRef, useEffect, useState } from "react"
import DropdownSection from "./DropdownSection";
import ScreenReader from "./ScreenReader";

interface Props {
  inputValue?: string,
  placeholder?: string,
  screenReaderInstructions: string,
  screenReaderInstructionsId: string,
  screenReaderText: string,
  onlyAllowDropdownOptionSubmissions: boolean,
  onSubmit?: (value: string) => void,
  onInputChange: (value: string) => void,
  onInputFocus: (input: string) => void,
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
  onlyAllowDropdownOptionSubmissions,
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
  const [childrenKey, setChildrenKey] = useState(0);
  const [screenReaderKey, setScreenReaderKey] = useState(0);

  const inputRef = useRef<HTMLInputElement>(document.createElement('input'));
  const dropdownRef = useRef<HTMLDivElement>(document.createElement('div'));

  if (!shouldDisplayDropdown && screenReaderKey) {
    setScreenReaderKey(0);
  }

  const childrenArray = React.Children.toArray(children);
  const childrenWithProps = childrenArray.map((child, index) => {
    if (!(React.isValidElement(child) && child.type === DropdownSection)) {
      return child;
    }

    const modifiedOnSelectOption = (optionValue: string, optionIndex: number) => {
      child.props.onSelectOption?.(optionValue, optionIndex);
      setLatestUserInput(optionValue);
      dispatch({ type: 'HideSections' });
    }

    const modifiedOnFocusChange = (value: string, focusedOptionId: string) => {
      child.props.onFocusChange?.(value, focusedOptionId);
      setFocusedOptionId(focusedOptionId);
    };

    if (focusedSectionIndex === undefined) {
      return React.cloneElement(child, { onLeaveSectionFocus, isFocused: false, key: `${index}-${childrenKey}`, onSelectOption: modifiedOnSelectOption });
    } else if (index === focusedSectionIndex) {
      return React.cloneElement(child, {
        onLeaveSectionFocus, isFocused: true, key: `${index}-${childrenKey}`, onFocusChange: modifiedOnFocusChange, onSelectOption: modifiedOnSelectOption
      });
    } else {
      return React.cloneElement(child, { onLeaveSectionFocus, isFocused: false, key: `${index}-${childrenKey}`, onSelectOption: modifiedOnSelectOption });
    }
  });

  const numSections = childrenWithProps.length;

  /**
   * Handles changing which section should become focused when focus leaves the currently-focused section.
   * @param pastSectionEnd Whether the section focus left from the end or the beginning of the section.
   */
  function onLeaveSectionFocus(pastSectionEnd: boolean) {
    if (focusedSectionIndex === undefined && pastSectionEnd) {
      dispatch({ type: 'FocusSection', newIndex: 0 });
    } else if (focusedSectionIndex !== undefined) {
      let newSectionIndex: number | undefined = pastSectionEnd
        ? focusedSectionIndex + 1
        : focusedSectionIndex - 1;
      if (newSectionIndex < 0) {
        newSectionIndex = undefined;
        onInputChange(latestUserInput);
      } else if (newSectionIndex > numSections - 1) {
        newSectionIndex = numSections - 1;
      }
      dispatch({ type: 'FocusSection', newIndex: newSectionIndex });
    }
  }

  function handleDocumentClick(evt: MouseEvent) {
    const target = evt.target as HTMLElement;
    if (!(target.isSameNode(inputRef.current) || (dropdownRef.current?.contains(target)))) {
      dispatch({ type: 'HideSections' });
    }
  }

  function handleDocumentKeydown(evt: globalThis.KeyboardEvent) {
    if (['ArrowDown', 'ArrowUp'].includes(evt.key)) {
      evt.preventDefault();
    }

    if (evt.key === 'Escape' || evt.key === 'Tab') {
      dispatch({ type: 'HideSections' });
    } else if (evt.key === 'ArrowDown' && numSections > 0 && focusedSectionIndex === undefined) {
      dispatch({ type: 'FocusSection', newIndex: 0 });
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

  function handleInputElementKeydown(evt: KeyboardEvent<HTMLInputElement>) {
    if (evt.key === 'Enter' && focusedSectionIndex === undefined && !onlyAllowDropdownOptionSubmissions) {
      setLatestUserInput(inputValue);
      onSubmit(inputValue);
      dispatch({ type: 'HideSections' });
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
            setLatestUserInput(value);
            onInputChange(value);
            onInputFocus(value);
            setChildrenKey(childrenKey + 1);
            dispatch({ type: 'ShowSections' });
            setScreenReaderKey(screenReaderKey + 1);
          }}
          onClick={() => {
            onInputFocus(inputValue);
            setChildrenKey(childrenKey + 1);
            dispatch({ type: 'ShowSections' });
            if (numSections > 0 || inputValue) {
              setScreenReaderKey(screenReaderKey + 1);
            }
          }}
          onKeyDown={handleInputElementKeydown}
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
        announcementText={screenReaderKey
          ? screenReaderText
          : ''
        }
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