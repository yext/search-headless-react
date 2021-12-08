import { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router";

export interface VerticalLink {
  label: string,
  verticalKey: string
}

export interface Option {
  value: string,
  verticalLinks?: VerticalLink[],
  render: (onClick: () => void, isOptionFocused: boolean, focusLinkIndex: number) => JSX.Element
}

export interface DropdownSectionCssClasses {
  sectionContainer?: string,
  sectionLabel?: string,
  optionsContainer?: string,
  optionContainer?: string,
  focusedOption?: string
}

export interface DropdownSectionProps {
  isFocused?: boolean,
  options: Option[],
  optionIdPrefix: string,
  onFocusChange?: (value: string, focusedOptionId: string) => void,
  onLeaveSectionFocus?: (pastSectionEnd: boolean) => void,
  onSelectOption?: (optionValue: string, optionIndex: number) => void,
  label?: string,
  cssClasses?: DropdownSectionCssClasses
}

export default function DropdownSection({
  isFocused = false,
  options,
  optionIdPrefix,
  onFocusChange = () => {},
  onLeaveSectionFocus = () => {},
  onSelectOption = () => {},
  label = '',
  cssClasses = {}
}: DropdownSectionProps): JSX.Element | null {

  const [focusedOptionIndex, setFocusedOptionIndex] = useState<number>(0);
  const [focusedLinkIndex, setFocusedLinkIndex] = useState<number>(-1);
  const browserHistory = useHistory();
  const wasFocused = useRef<boolean>(isFocused);

  function updateToNextFocusElement() {
    if(!incrementVerticalLinkFocus()) {
      incrementOptionFocus();
    }
  }

  /**
   * returns true if the increment was successful and the current focused
   * option should remain unchange.
   */
  function incrementVerticalLinkFocus(): boolean {
    const verticalLinks = options[focusedOptionIndex]?.verticalLinks;
    if (!verticalLinks) {
      return false;
    }
    if (focusedLinkIndex !== verticalLinks.length - 1) {
      setFocusedLinkIndex(focusedLinkIndex + 1);
      return true;
    } else if (focusedOptionIndex < options.length - 1) {
      setFocusedLinkIndex(-1);
    }
    return false;
  }
  function incrementOptionFocus() {
    let newIndex = focusedOptionIndex + 1;
    if (newIndex < options.length) {
      onFocusChange(options[newIndex].value, `${optionIdPrefix}-${newIndex}`);
    } else {
      onLeaveSectionFocus(true);
      newIndex = options.length - 1;
    }
    setFocusedOptionIndex(newIndex);
  }

  function updateToPrevFocusElement() {
    if(!decrementVerticalLinkFocus()) {
      decrementOptionFocus();
    }
  }

  /**
   * returns true if the decrement was successful and the current focused
   * option should remain unchange.
   */
  function decrementVerticalLinkFocus(): boolean {
    const verticalLinks = options[focusedOptionIndex]?.verticalLinks;
    if (!verticalLinks) {
      return false;
    }
    if (focusedLinkIndex !== -1) {
      setFocusedLinkIndex(focusedLinkIndex - 1);
      return true;
    } else if (focusedOptionIndex === 0) {
      setFocusedLinkIndex(-1);
    } else {
      const nextOptionLinks = options[focusedOptionIndex - 1].verticalLinks;
      nextOptionLinks && setFocusedLinkIndex(nextOptionLinks.length - 1);
    }
    return false;
  }

  function decrementOptionFocus() {
    let newIndex = focusedOptionIndex - 1;
    if (newIndex > -1) {
      onFocusChange(options[newIndex].value, `${optionIdPrefix}-${newIndex}`);
    } else {
      onLeaveSectionFocus(false);
      newIndex = 0;
    }
    setFocusedOptionIndex(newIndex);
  }

  function handleKeyDown(evt: globalThis.KeyboardEvent) {
    if (['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].includes(evt.key)) {
      evt.preventDefault();
    }

    if (evt.key === 'ArrowDown' || evt.key === 'ArrowRight') {
      updateToNextFocusElement();
    } else if (evt.key === 'ArrowUp' || evt.key === 'ArrowLeft') {
      updateToPrevFocusElement();
    } else if (evt.key === 'Enter') {
      onSelectOption(options[focusedOptionIndex].value, focusedOptionIndex);
      if (focusedLinkIndex !== -1) {
        const verticalLinks = options[focusedOptionIndex]?.verticalLinks;
        if (verticalLinks) {
          browserHistory.push(`/${verticalLinks[focusedLinkIndex].verticalKey}`);
        }
      }
    }
  }

  useEffect(() => {
    if (isFocused) {
      if (!wasFocused.current) {
        onFocusChange(options[focusedOptionIndex].value, `${optionIdPrefix}-${focusedOptionIndex}`);
      }
      wasFocused.current = true;
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
    else {
      wasFocused.current = false;
    }
  });

  function renderOption(option: Option, index: number) {
    const isOptionFocused = isFocused && index === focusedOptionIndex;
    const onClick = () => onSelectOption(option.value, index);
    return (
      <div
        key={index}
        className={cssClasses.optionContainer}
        id={`${optionIdPrefix}-${index}`}
        tabIndex={0}
      >
        {option.render(onClick, isOptionFocused, focusedLinkIndex)}
      </div>
    );
  }

  return (
    <div className={cssClasses.sectionContainer}>
      {label &&
        <div className={cssClasses.sectionLabel}>
          {label}
        </div>
      }
      <div className={cssClasses.optionsContainer}>
        {options.map((option, index) => renderOption(option, index))}
      </div>
    </div>
  );
};
