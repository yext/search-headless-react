import classNames from "classnames";
import { useState, useEffect, useRef } from "react";

export interface Option {
  value: string,
  display: JSX.Element
}

export interface DropdownSectionProps {
  focusStatus?: string,
  options: Option[],
  optionIdPrefix: string,
  onFocusChange?: (value: string, focusedOptionId: string) => void,
  onLeaveSectionFocus?: (pastSectionEnd: boolean) => void,
  onSelect?: (optionValue: string, optionIndex: number) => void,
  label?: string,
  cssClasses: {
    sectionContainer: string,
    sectionLabel: string,
    optionsContainer: string,
    option: string,
    focusedOption: string
  }
}

export default function DropdownSection({
  focusStatus,
  options,
  optionIdPrefix,
  onFocusChange = () => {},
  onLeaveSectionFocus = () => {},
  onSelect = () => {},
  label = '',
  cssClasses
}: DropdownSectionProps): JSX.Element | null {

  const [focusedOptionIndex, setFocusedOptionIndex] = useState<number>(0);
  const wasActive = useRef<boolean>(focusStatus === 'active');

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
      incrementOptionFocus();
    } else if (evt.key === 'ArrowUp' || evt.key === 'ArrowLeft') {
      decrementOptionFocus();
    } else if (evt.key === 'Enter') {
      onSelect(options[focusedOptionIndex].value, focusedOptionIndex);
    }
  }

  useEffect(() => {
    if (focusStatus === 'active') {
      if (!wasActive.current) {
        onFocusChange(options[focusedOptionIndex].value, `${optionIdPrefix}-${focusedOptionIndex}`);
      }
      wasActive.current = true;
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
    else {
      wasActive.current = false;
    }
  });

  function renderOption(option: Option, index: number) {
    const className = classNames(cssClasses.option, {
      [cssClasses.focusedOption]: focusStatus === 'active' && index === focusedOptionIndex
    })
    return (
      <div
        key={index}
        className={className}
        id={`${optionIdPrefix}-${index}`}
        onClick={() => onSelect(option.value, index)}>
        {option.display}
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
