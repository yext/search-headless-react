import React, { useReducer, KeyboardEvent, useRef, useEffect, useState } from "react"
import DropdownSection, { Option } from "./DropdownSection";
import ScreenReader from "./ScreenReader";

interface Props {
  inputValue?: string,
  placeholder?: string,
  screenReaderInstructions: string,
  screenReaderInstructionsId: string,
  screenReaderText: string,
  onSubmit?: (value: string) => void,
  renderSearchButton?: () => JSX.Element | null,
  renderLogo?: () => JSX.Element | null,
  onInputChange: (value: string) => void,
  onInputFocus: () => void,
  cssClasses: {
    dropdownContainer?: string,
    inputElement?: string,
    inputContainer?: string,
    logoContainer?: string,
    searchButtonContainer?: string,
    divider?: string
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
  renderSearchButton = () => null,
  renderLogo = () => null,
  onInputChange,
  onInputFocus,
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

    const modifiedOnClickOption = (option: Option, optionIndex: number) => {
      child.props.onClickOption?.(option, optionIndex);
      dispatch({ type: 'HideSections' });
    }

    const modifiedOnFocusChange = (value: string, focusedOptionId: string) => {
      child.props.onFocusChange?.(value, focusedOptionId);
      setFocusedOptionId(focusedOptionId);
    };

    if (focusedSectionIndex === undefined) {
      return React.cloneElement(child, { onLeaveSectionFocus, focusStatus: 'inactive', key: `${index}-${childrenKey}`, onClickOption: modifiedOnClickOption });
    } else if (index === focusedSectionIndex) {
      return React.cloneElement(child, {
        onLeaveSectionFocus, focusStatus: 'active', key: `${index}-${childrenKey}`, onFocusChange: modifiedOnFocusChange, onClickOption: modifiedOnClickOption
      });
    } else {
      return React.cloneElement(child, { onLeaveSectionFocus, focusStatus: 'inactive', key: `${index}-${childrenKey}`, onClickOption: modifiedOnClickOption });
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
    if (['ArrowDown'].includes(evt.key)) {
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
    if (evt.key === 'Enter') {
      onInputChange(inputValue);
      onSubmit(inputValue);
      dispatch({ type: 'HideSections' });
    }
  }

  return (
    <>
      <div className={cssClasses.inputContainer}>
        <div className={cssClasses.logoContainer}>
          {renderLogo()}
        </div>
        <input
          className={cssClasses.inputElement}
          placeholder={placeholder}
          onChange={evt => {
            const value = evt.target.value;
            setLatestUserInput(value);
            onInputChange(value);
            onInputFocus();
            setChildrenKey(childrenKey + 1);
            dispatch({ type: 'ShowSections' });
            setScreenReaderKey(screenReaderKey + 1);
          }}
          onClick={() => {
            onInputFocus();
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
        <div className={cssClasses.searchButtonContainer}>
          {renderSearchButton()}
        </div>
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
        <>
          <div className={cssClasses.divider}></div>
          <div className={cssClasses.dropdownContainer} ref={dropdownRef}>
            {childrenWithProps}
          </div>
        </>
      }
    </>
  );
};