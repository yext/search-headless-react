import classNames from "classnames";
import { useState, useEffect, useRef } from "react";

export interface Option {
  value: string,
  onSelect: () => void,
  display: JSX.Element
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
  label?: string,
  cssClasses?: DropdownSectionCssClasses
}

export default function DropdownSection({
  isFocused = false,
  options,
  optionIdPrefix,
  onFocusChange = () => {},
  onLeaveSectionFocus = () => {},
  label = '',
  cssClasses = {}
}: DropdownSectionProps): JSX.Element | null {

  const [focusedOptionIndex, setFocusedOptionIndex] = useState<number>(0);
  const wasFocused = useRef<boolean>(isFocused);
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
      options[focusedOptionIndex].onSelect();
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
    const optionContainterCssClasses = cssClasses.focusedOption
      ? classNames(cssClasses.optionContainer, {
        [cssClasses.focusedOption]: isFocused && index === focusedOptionIndex
      })
      : cssClasses.optionContainer;
    return (
      <div
        key={index}
        className={optionContainterCssClasses}
        onClick={option.onSelect}
        id={`${optionIdPrefix}-${index}`}
        tabIndex={0}
      >
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
