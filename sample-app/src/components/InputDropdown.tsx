import React, { useReducer, KeyboardEvent, useRef, useEffect, useState, FocusEvent } from "react"
import DropdownSection, { DropdownSectionProps } from "./DropdownSection";
import ScreenReader from "./ScreenReader";
import recursivelyMapChildren from './utils/recursivelyMapChildren';

export interface InputDropdownCssClasses {
  dropdownContainer?: string,
  inputElement?: string,
  inputContainer?: string,
  divider?: string,
  logoContainer?: string,
  searchButtonContainer?: string
}

interface Props {
  inputValue?: string,
  placeholder?: string,
  screenReaderInstructions: string,
  screenReaderInstructionsId: string,
  screenReaderText: string,
  onlyAllowDropdownOptionSubmissions?: boolean,
  forceHideDropdown?: boolean,
  onSubmit?: (value: string) => void,
  renderSearchButton?: () => JSX.Element | null,
  renderLogo?: () => JSX.Element | null,
  onInputChange: (value: string) => void,
  onInputFocus: (value: string) => void,
  cssClasses?: InputDropdownCssClasses
}

interface State {
  focusedSectionIndex?: number,
  dropdownHidden: boolean
}

type Action =
  | { type: 'HideSections' }
  | { type: 'ShowSections' }
  | { type: 'FocusSection', newIndex?: number }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'HideSections':
      return { focusedSectionIndex: undefined, dropdownHidden: true }
    case 'ShowSections':
      return { focusedSectionIndex: undefined, dropdownHidden: false }
    case 'FocusSection':
      return { focusedSectionIndex: action.newIndex, dropdownHidden: false }
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
  forceHideDropdown,
  children,
  onSubmit = () => {},
  renderSearchButton = () => null,
  renderLogo = () => null,
  onInputChange,
  onInputFocus,
  cssClasses = {}
}: React.PropsWithChildren<Props>): JSX.Element | null {
  const [{
    focusedSectionIndex,
    dropdownHidden,
  }, dispatch] = useReducer(reducer, {
    focusedSectionIndex: undefined,
    dropdownHidden: true,
  });
  const shouldDisplayDropdown = !dropdownHidden && !forceHideDropdown;

  const [focusedOptionId, setFocusedOptionId] = useState<string | undefined>(undefined);
  const [latestUserInput, setLatestUserInput] = useState(inputValue);
  const [childrenKey, setChildrenKey] = useState(0);
  const [screenReaderKey, setScreenReaderKey] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputDropdownRef = useRef<HTMLDivElement>(null);
  if (!shouldDisplayDropdown && screenReaderKey) {
    setScreenReaderKey(0);
  }

  let numSections = 0;
  const childrenWithProps = recursivelyMapChildren(children, (child, index) => {
    if (!(React.isValidElement(child) && child.type === DropdownSection)) {
      return child;
    }
    numSections++;

    let childProps = child.props as DropdownSectionProps;
    const modifiedOptions = childProps.options.map(option => {
      const modifiedOnSelect = () => {
        setLatestUserInput(option.value);
        dispatch({ type: 'HideSections' });
        option.onSelect?.(); 
      }
      return { ...option, onSelect: modifiedOnSelect }
    });

    const modifiedOnFocusChange = (value: string, focusedOptionId: string) => {
      child.props.onFocusChange?.(value, focusedOptionId);
      setFocusedOptionId(focusedOptionId);
    };

    if (focusedSectionIndex === undefined) {
      return React.cloneElement(child, { 
        onLeaveSectionFocus,
        options: modifiedOptions,
        isFocused: false,
        key: `${index}-${childrenKey}`
      });
    } else if (index === focusedSectionIndex) {
      return React.cloneElement(child, {
        onLeaveSectionFocus,
        options: modifiedOptions,
        isFocused: true,
        key: `${index}-${childrenKey}`,
        onFocusChange: modifiedOnFocusChange
      });
    } else {
      return React.cloneElement(child, {
        onLeaveSectionFocus,
        options: modifiedOptions,
        isFocused: false,
        key: `${index}-${childrenKey}`
      });
    }
  });


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

    if (evt.key === 'Escape') {
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
    if (evt.key === 'Enter' 
      && evt.target === inputRef.current
      && focusedSectionIndex === undefined
      && !onlyAllowDropdownOptionSubmissions
    ) {
      setLatestUserInput(inputValue);
      onSubmit(inputValue);
      dispatch({ type: 'HideSections' });
    }
  }

  function handleBlur(evt: FocusEvent<HTMLDivElement>) {
    if (!evt.relatedTarget || !(evt.relatedTarget instanceof HTMLElement) || !inputDropdownRef.current) {
      return;
    }
    if (!inputDropdownRef.current.contains(evt.relatedTarget)) {
      dispatch({ type: 'HideSections' });
    }
  }

  return (
    <div ref={inputDropdownRef} onBlur={handleBlur}>
      <div className={cssClasses?.inputContainer}>
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
      {shouldDisplayDropdown &&
        <>
          <div className={cssClasses.divider}></div>
          <div className={cssClasses.dropdownContainer} ref={dropdownRef}>
            {childrenWithProps}
          </div>
        </>
      }
    </div>
  );
};
